function crearNivel(scene) {
  // Grupo estático de plataformas
  scene.platforms = scene.physics.add.staticGroup();

  // Suelo largo
  scene.platforms.create(450, 490, null).setDisplaySize(900, 20).refreshBody();

  // Plataformas dispersas (x, y, width)
  const plats = [
    {x: 250, y: 380, w: 180},
    {x: 520, y: 320, w: 140},
    {x: 760, y: 380, w: 160},
    {x: 1020, y: 260, w: 160},
    {x: 1300, y: 360, w: 200}
  ];

  plats.forEach(p=>{
    const r = scene.add.rectangle(p.x, p.y, p.w, 14, 0x334155).setOrigin(0.5);
    scene.physics.add.existing(r, true);
    scene.platforms.add(r);
  });

  // Goal (meta) al final del nivel
  const goalX = 1500, goalY = 420;
  scene.goal = scene.add.container(goalX, goalY);
  const gRect = scene.add.rectangle(0, 0, 48, 64, 0x00ff99).setOrigin(0.5);
  const gFlag = scene.add.text(-14, -6, "🏁", {fontSize:"28px"});
  scene.goal.add([gRect, gFlag]);
  scene.physics.world.enable(scene.goal, 1);
  scene.goal.body.setSize(48,64);
  scene.goal.body.setImmovable(true);

  // Collectibles: monedas
  scene.coins = scene.physics.add.group({ allowGravity:false });
  const coinPositions = [
    {x:220,y:340}, {x:540,y:280}, {x:780,y:340},
    {x:1040,y:220}, {x:1330,y:320}, {x:1450,y:360}
  ];
  coinPositions.forEach(c=>{
    const coin = scene.add.rectangle(c.x, c.y, 12, 12, 0xffd166).setOrigin(0.5);
    scene.physics.add.existing(coin, false);
    coin.body.setAllowGravity(false);
    coin.body.setCircle(6);
    scene.coins.add(coin);
  });
}
