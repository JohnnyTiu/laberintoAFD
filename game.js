// -------------------
// CONFIG PHASER
// -------------------
const WIDTH = 900, HEIGHT = 500;
const config = {
  type: Phaser.AUTO,
  parent: 'gameContainer',
  width: WIDTH, height: HEIGHT,
  backgroundColor: 0x071022,
  physics: { default: 'arcade', arcade: { gravity: { y: 700 }, debug: false } },
  scene: { preload, create, update }
};
const game = new Phaser.Game(config);

// -------------------
// AUDIO (WebAudio synth)
// -------------------
class AudioSynth {
  constructor() {
    this.ctx = null;
    this.musicOsc = null;
    this.musicGain = null;
    this.isPlaying = false;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    } catch(e){
      console.warn("WebAudio no disponible");
    }
  }

  playCollect() {
    if(!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "square";
    const now = this.ctx.currentTime;
    o.frequency.setValueAtTime(1200, now);
    o.frequency.exponentialRampToValueAtTime(600, now+0.12);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.2, now+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now+0.16);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(now); o.stop(now+0.18);
  }

  startMusic() {
    if(!this.ctx || this.isPlaying) return;
    const now = this.ctx.currentTime;
    // Create two oscillators for a simple ambient loop
    const o1 = this.ctx.createOscillator(), o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o1.type = "sine"; o2.type = "sine";
    o1.frequency.setValueAtTime(220, now);
    o2.frequency.setValueAtTime(330, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.06, now + 1);
    o1.connect(g); o2.connect(g); g.connect(this.ctx.destination);
    o1.start(now); o2.start(now);
    // simple detune/drift
    o1.frequency.setValueAtTime(220, now);
    o2.frequency.setValueAtTime(330, now);
    // Save references
    this.musicOsc = [o1,o2]; this.musicGain = g; this.isPlaying = true;
    // Loop handling: we won't stop — keep ambient and low volume
  }

  stopMusic() {
    if(!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    this.musicGain.gain.linearRampToValueAtTime(0.0001, now+0.6);
    this.musicOsc.forEach(o => o.stop(now+0.61));
    this.isPlaying = false;
  }
}
const synth = new AudioSynth();

// -------------------
// SCENE
// -------------------
function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('npc', 'assets/enemy.png');
    this.load.audio('music', 'assets/music.mp3');
    this.load.audio('coin', 'assets/coin.wav');
}


function create(){
  const scene = this;

  // camera and world size bigger than viewport (side scroll)
  this.cameras.main.setBounds(0, 0, 1600, HEIGHT);
  this.physics.world.setBounds(0, 0, 1600, HEIGHT);

  // ⚡ Create simple textures (pixel style)
  createPixelTextures(this);

  // PLAYER: auto avanza hacia la derecha
  this.player = this.physics.add.sprite(80, 400, 'player').setScale(1).setDepth(2);
  this.player.setCollideWorldBounds(true);
  this.player.setBounce(0.02);
  this.player.setSize(18, 28).setOffset(7,4);

  // Partículas - estela del jugador (efecto 1)
  this.particles = this.add.particles('particle'); // small square
  this.emitter = this.particles.createEmitter({
    speed: {min: -40, max: -100},
    scale: { start: 0.6, end: 0 },
    alpha: { start: 0.8, end: 0 },
    lifespan: 500,
    quantity: 1,
    follow: this.player,
    followOffset: { x: -8, y: 6 }
  });

  // Crear nivel (plataformas, meta, monedas)
  crearNivel(this);

  // Colisiones
  this.physics.add.collider(this.player, this.platforms);
  this.physics.add.collider(this.goal, this.platforms);
  this.physics.add.collider(this.coins, this.platforms);

  // Camera follow player
  this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

  // Input
  this.cursors = this.input.keyboard.createCursorKeys();

  // Score
  this.score = 0;
  this.scoreText = this.add.text(14,14, 'Puntos: 0', {fontSize:'18px', fontFamily:'Arial'}).setScrollFactor(0).setDepth(5);

  // Overlap coin collection (plays collect sound B)
  this.physics.add.overlap(this.player, this.coins, (p, coin) => {
    coin.destroy();
    synth.playCollect();
    this.score += 10;
    this.scoreText.setText('Puntos: ' + this.score);
    // small particle burst
    this.particles.createEmitter({
      x: coin.x, y: coin.y, speed: {min:-80,max:80}, lifespan:300, quantity:8, scale:{start:0.6,end:0}
    }).explode(8, coin.x, coin.y);
  });

  // Overlap goal -> victory (fade-out + credits)
  this.physics.add.overlap(this.player, this.goal, () => {
    this.cameras.main.fadeOut(600, 0, 0, 0);
    synth.stopMusic();
    this.cameras.main.once('camerafadeoutcomplete', () => showVictory(scene));
  });

  // -------------------
  // NPC enemy with DFA
  // -------------------
  // enemy object will be created with 2-frame animation
  this.npc = this.physics.add.sprite(500, 420, 'enemy_anim').setDepth(2);
  this.npc.setCollideWorldBounds(true);
  this.npc.setSize(18,28).setOffset(7,4);
  this.npc.body.setImmovable(false);
  this.npcPatrolPoints = [ {x:480,y:420},{x:720,y:420} ];
  this.npcIndex = 0;
  this.npcSpeed = 70;

  // animate enemy frames
  this.anims.create({ key:'enemy_walk', frames: this.anims.generateFrameNames('enemy_anim', {start:0, end:1}), frameRate:6, repeat:-1 });
  this.npc.play('enemy_walk');

  // collision with platforms
  this.physics.add.collider(this.npc, this.platforms);

  // player vs npc overlap -> damage (parpadeo al recibir daño: efecto 4)
  this.physics.add.overlap(this.player, this.npc, () => {
    const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
    if (d < 30 && !this.playerInvulnerable) {
      playerHit.call(this);
    }
  });

  // DFA instance
  this.dfa = new NPCDFA();

  // create a small text showing current DFA state (for demo)
  this.dfaText = this.add.text(14, 38, 'Estado NPC: PATRULLAR', {fontSize:'16px', fontFamily:'Arial'}).setScrollFactor(0).setDepth(5);

  // PLAY MUSIC (synth)
  synth.startMusic();

  // camera fade-in (effect 5)
  this.cameras.main.fadeIn(600, 0, 0, 0);
}

// -------------------
// UTILS
// -------------------
function createPixelTextures(scene) {
  // player (blue square pixel)
  const g = scene.make.graphics({x:0,y:0,add:false});
  g.fillStyle(0x7dd3fc,1);
  g.fillRect(0,0,32,40);
  g.generateTexture('player', 32,40);
  g.clear();

  // particle (small)
  g.fillStyle(0xfff1a6,1);
  g.fillRect(0,0,6,6);
  g.generateTexture('particle', 6,6);
  g.clear();

  // enemy two-frame "pixel" animation: frame0 and frame1 (slight offset)
  const eW = 32, eH = 40;
  g.fillStyle(0xff6b6b,1);
  g.fillRect(0,0,eW,eH);
  g.generateTexture('enemy_f0', eW, eH);
  g.clear();
  const g2 = scene.make.graphics({x:0,y:0,add:false});
  g2.fillStyle(0xff6b6b,1);
  g2.fillRect(0,0,eW,eH);
  // draw an eye pixel offset to simulate animation
  g2.fillStyle(0x111827,1);
  g2.fillRect(10,10,4,4);
  g2.generateTexture('enemy_f1', eW, eH);
  g2.clear();

  // create an atlas-like texture by copying frames into a sprite sheet
  // Phaser anim generator can take frame names, so create a RenderTexture and draw both frames then create texture with names
  // Simpler: create a 'enemy_anim' sprite sheet using each frame as separate texture by drawing them to a dynamic atlas
  scene.textures.addSpriteSheetFromAtlas('enemy_anim', {
    atlas: { frames: [{ key:'enemy_f0' }, { key:'enemy_f1' }] },
    frameWidth: eW, frameHeight: eH
  });
}

function updateNPC(scene) {
  const npc = scene.npc;
  // distance player-npc
  const dist = Phaser.Math.Distance.Between(scene.player.x, scene.player.y, npc.x, npc.y);

  // detection radius
  const detectRange = 160;

  if (dist < detectRange) {
    scene.dfa.transition('veJugador');
  } else {
    scene.dfa.transition('pierdeJugador');
  }

  // update DFA text
  scene.dfaText.setText('Estado NPC: ' + scene.dfa.state);

  // behavior by state
  if (scene.dfa.state === 'PATRULLAR') {
    // move along patrol points
    const target = scene.npcPatrolPoints[scene.npcIndex];
    scene.physics.moveTo(npc, target.x, target.y, scene.npcSpeed);
    const d = Phaser.Math.Distance.Between(npc.x, npc.y, target.x, target.y);
    if (d < 6) {
      scene.npcIndex = (scene.npcIndex + 1) % scene.npcPatrolPoints.length;
    }
  } else if (scene.dfa.state === 'ALERTA') {
    // stop and "look" (flash tint)
    npc.setVelocityX(0);
    npc.setTint(0xffff66);
  } else if (scene.dfa.state === 'PERSEGUIR') {
    // pursue: move toward player horizontally and small vertical correction
    scene.physics.moveToObject(npc, scene.player, 160);
    npc.clearTint();
  } else if (scene.dfa.state === 'REGRESAR') {
    // go back to initial patrol start
    const start = scene.npcPatrolPoints[0];
    scene.physics.moveTo(npc, start.x, start.y, 90);
    const d0 = Phaser.Math.Distance.Between(npc.x, npc.y, start.x, start.y);
    if (d0 < 6) scene.dfa.transition('llegaPatrulla');
  }

  // simple flip based on velocity
  npc.setFlipX(npc.body.velocity.x < 0);
}

// player hit handling (parpadeo efecto 4)
function playerHit() {
  // set invulnerable briefly
  this.playerInvulnerable = true;
  this.player.setTint(0xff6b6b);
  this.player.scene.tweens.add({
    targets: this.player,
    alpha: 0.2,
    ease: 'Linear',
    duration: 80,
    yoyo: true,
    repeat: 6,
    onComplete: () => {
      this.player.clearTint();
      this.player.setAlpha(1);
      this.playerInvulnerable = false;
    }
  });
  // small knockback
  this.player.setVelocityY(-220);
  const push = (this.player.x < this.npc.x) ? -160 : 160;
  this.player.setVelocityX(push);
}

// victory screen
function showVictory(scene) {
  scene.scene.pause();
  const cx = scene.cameras.main.worldView.x + WIDTH/2;
  const cy = scene.cameras.main.worldView.y + HEIGHT/2;
  const title = scene.add.text(cx-160, cy-70, "¡¡VICTORIA!! 🎉", {fontSize:"56px", fontFamily:"Arial"});
  const sub = scene.add.text(cx-220, cy, "Desarrollado por:\nJohnny Tiu & Luis Martínez", {fontSize:"24px", fontFamily:"Arial"});
  title.setDepth(10); sub.setDepth(10);
  scene.cameras.main.flash(500, 255,255,255);
}

// -------------------
// UPDATE
// -------------------
function update(time, delta) {
  // auto-move forward (player constant forward velocity)
  const scene = this;
  const baseSpeed = 120;
  // allow small speed boost when holding right
  const boost = this.cursors.right.isDown ? 80 : 0;
  this.player.setVelocityX(baseSpeed + boost);

  // jump if on ground
  if ((this.cursors.up.isDown || this.cursors.space?.isDown) && this.player.body.touching.down) {
    this.player.setVelocityY(-340);
  }

  // update NPC brain and movement
  updateNPC(this);

  // check if player falls below world
  if (this.player.y > HEIGHT + 120) {
    // respawn at start (simple)
    this.player.setPosition(80, 400);
    this.cameras.main.flash(200, 255, 80, 80);
  }
}
