// ====================== VARIABLES GLOBALES ======================
var rocaImg;
var puntoImg;
var playerImg;
var rocas = [];
var puntos = [];
var enemigos = [];
var player = null;
var plat;
var tileSize = 50;

// ✅ Puntaje
var score = 0;

// ✅ Nuevas variables para efectos visuales
var bgGradient;
var particles = [];
var gameStarted = false;
var gameOver = false;
var win = false;
var collectedParticles = [];

// ====================== PRELOAD ======================
function preload() {
  rocaImg = loadImage('assets/roca.png', () => console.log('✅ roca cargada'));
  puntoImg = loadImage('assets/cafe.jpg', () => console.log('✅ café cargado'));

  // 🔥 Cargar y redimensionar el jugador
  playerImg = loadImage('assets/playerNuevo.png', img => {
    console.log('✅ jugador nuevo cargado');
    playerImg = img;
    playerImg.resize(25, 25);
  }, () => {
    console.error('❌ No se pudo cargar playerNuevo.png');
    // Crear imagen de respaldo
    playerImg = null;
  });
}

// ====================== SETUP ======================
function setup() {
  let canvas = createCanvas(1000, 600);
  canvas.parent('contenedor');

  plat = new Plataforma();

  // Generar rocas (muros)
  for (let i = 0; i < plat.filas; i++) {
    for (let j = 0; j < plat.columnas; j++) {
      if (plat.platform[i][j] === '*') {
        rocas.push(new Roca(j * tileSize, i * tileSize));
      }
    }
  }

  // Generar puntos (cafés)
  for (let i = 0; i < plat.filas; i++) {
    for (let j = 0; j < plat.columnas; j++) {
      if (plat.platform[i][j] === 'o') {
        puntos.push(new Punto(j * tileSize, i * tileSize));
      }
    }
  }

  // ✅ Generar enemigos donde la plataforma tenga 'e'
  for (let i = 0; i < plat.filas; i++) {
    for (let j = 0; j < plat.columnas; j++) {
      if (plat.platform[i][j] === 'e') {
        enemigos.push(new Enemigo(j * tileSize, i * tileSize));
      }
    }
  }

  // Crear jugador donde la plataforma tenga 'p'
  for (let i = 0; i < plat.filas; i++) {
    for (let j = 0; j < plat.columnas; j++) {
      if (plat.platform[i][j] === 'p') {
        player = new Jugador(j * tileSize, i * tileSize);
        console.log("✅ Jugador creado en:", player.x, player.y);
      }
    }
  }

  // Si no hay enemigos definidos en el mapa, crear uno aleatorio
  if (enemigos.length === 0) {
    generarEnemigoAleatorio();
  }

  // Inicializar partículas de fondo
  initParticles();
  
  // Crear gradiente de fondo
  createBackgroundGradient();
  
  gameStarted = true;
}

// ====================== DRAW ======================
function draw() {
  // Fondo con gradiente
  drawBackground();
  
  // Actualizar y mostrar partículas
  updateParticles();
  
  // Mostrar muros con efecto de profundidad
  for (let r of rocas) r.show();

  // Mostrar puntos (cafés) con efecto de brillo
  for (let p of puntos) p.show();

  // ✅ Mostrar y actualizar enemigos
  for (let e of enemigos) {
    if (!gameOver) {
      e.mover();
      e.intentarTeleport();
    }
    e.show();
  }

  // Mostrar jugador (si el juego no ha terminado)
  if (player && !gameOver) {
    player.mover();
    player.show();
    
    // Efecto de sombra bajo el jugador
    drawPlayerShadow();
  }

  // Mostrar partículas de colección
  updateCollectedParticles();

  // Mostrar puntaje
  drawScore();
  
  // Verificar condición de victoria
  checkWinCondition();
  
  // Mostrar mensajes de juego
  drawGameMessages();
}

// ====================== NUEVAS FUNCIONES VISUALES ======================

// Crear gradiente de fondo
function createBackgroundGradient() {
  bgGradient = drawingContext.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, color(26, 15, 7));
  bgGradient.addColorStop(1, color(62, 39, 35));
}

// Dibujar fondo con gradiente
function drawBackground() {
  drawingContext.fillStyle = bgGradient;
  drawingContext.fillRect(0, 0, width, height);
  
  // Patrón de textura sutil
  fill(30, 15, 10, 10);
  noStroke();
  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < height; y += 20) {
      if ((x + y) % 40 === 0) {
        rect(x, y, 2, 2);
      }
    }
  }
}

// Inicializar partículas de fondo
function initParticles() {
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 6),
      speed: random(0.2, 0.8),
      alpha: random(30, 80)
    });
  }
}

// Actualizar partículas de fondo
function updateParticles() {
  fill(255, 200, 100);
  noStroke();
  
  for (let p of particles) {
    p.y -= p.speed;
    if (p.y < -10) {
      p.y = height + 10;
      p.x = random(width);
    }
    
    fill(255, 200, 100, p.alpha);
    ellipse(p.x, p.y, p.size, p.size);
  }
}

// Dibujar sombra bajo el jugador
function drawPlayerShadow() {
  fill(0, 0, 0, 40);
  noStroke();
  ellipse(player.x + player.width/2, player.y + player.height + 5, player.width * 0.8, player.height * 0.3);
}

// Dibujar puntaje con estilo mejorado
function drawScore() {
  // Fondo del marcador
  fill(44, 24, 16, 200);
  stroke(139, 69, 19);
  strokeWeight(2);
  rect(10, 10, 180, 40, 10);
  
  // Texto del marcador
  fill(255, 215, 0);
  noStroke();
  textSize(20);
  textFont('Segoe UI');
  textAlign(LEFT, CENTER);
  text("Cafés: " + score, 25, 30);
  
  // Actualizar el marcador en el HTML
  document.getElementById('score-display').textContent = score;
}

// Crear efecto de partículas al recolectar café
function createCollectionEffect(x, y) {
  for (let i = 0; i < 8; i++) {
    collectedParticles.push({
      x: x + 25,
      y: y + 25,
      size: random(3, 8),
      speedX: random(-2, 2),
      speedY: random(-3, -1),
      alpha: 255,
      color: color(255, 200, 0)
    });
  }
}

// Actualizar partículas de colección
function updateCollectedParticles() {
  for (let i = collectedParticles.length - 1; i >= 0; i--) {
    let p = collectedParticles[i];
    
    p.x += p.speedX;
    p.y += p.speedY;
    p.alpha -= 8;
    p.size *= 0.95;
    
    fill(red(p.color), green(p.color), blue(p.color), p.alpha);
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);
    
    if (p.alpha <= 0 || p.size < 0.5) {
      collectedParticles.splice(i, 1);
    }
  }
}

// Verificar condición de victoria
function checkWinCondition() {
  if (puntos.length === 0 && !win && !gameOver) {
    win = true;
    // Efecto de victoria
    for (let i = 0; i < 50; i++) {
      collectedParticles.push({
        x: random(width),
        y: random(height),
        size: random(5, 15),
        speedX: random(-1, 1),
        speedY: random(-2, 0),
        alpha: 255,
        color: color(random(200, 255), random(200, 255), random(100, 200))
      });
    }
  }
}

// Dibujar mensajes de juego
function drawGameMessages() {
  textAlign(CENTER, CENTER);
  textSize(32);
  
  if (win) {
    fill(255, 215, 0, 200);
    text("¡Felicidades! ¡Recolectaste todos los cafés!", width/2, height/2 - 50);
    
    fill(255, 255, 255, 180);
    textSize(20);
    text("Presiona F5 para jugar de nuevo", width/2, height/2 + 10);
  }
  
  // ✅ Mensaje de Game Over
  if (gameOver) {
    fill(255, 50, 50, 200);
    text("¡Game Over! El enemigo te atrapó", width/2, height/2 - 50);
    
    fill(255, 255, 255, 180);
    textSize(20);
    text("Puntuación final: " + score, width/2, height/2);
    text("Presiona F5 para intentarlo de nuevo", width/2, height/2 + 30);
  }
}

// ====================== FUNCIONES PARA ENEMIGOS ======================

// Generar enemigo en posición aleatoria
function generarEnemigoAleatorio() {
  let libres = [];

  for (let i = 0; i < plat.filas; i++) {
    for (let j = 0; j < plat.columnas; j++) {
      if (plat.platform[i][j] === ' ') {
        // Verificar que no esté muy cerca del jugador
        let posX = j * tileSize;
        let posY = i * tileSize;
        let distJugador = dist(posX, posY, player.x, player.y);
        
        if (distJugador > 300) {
          libres.push({ x: j, y: i });
        }
      }
    }
  }

  if (libres.length > 0) {
    let celda = random(libres);
    enemigos.push(new Enemigo(celda.x * tileSize, celda.y * tileSize));
  }
}

// Efecto visual de game over
function createGameOverEffect() {
  for (let i = 0; i < 30; i++) {
    collectedParticles.push({
      x: player.x + player.width/2,
      y: player.y + player.height/2,
      size: random(5, 12),
      speedX: random(-3, 3),
      speedY: random(-3, 3),
      alpha: 255,
      color: color(255, 50, 50)
    });
  }
}

// ====================== FUNCIÓN GENERAR NUEVO CAFÉ ======================
function generarPuntoAleatorio() {
  let libres = [];

  for (let i = 0; i < plat.filas; i++) {
    for (let j = 0; j < plat.columnas; j++) {
      if (plat.platform[i][j] === ' ') {
        libres.push({ x: j, y: i });
      }
    }
  }

  if (libres.length > 0) {
    let celda = libres[floor(random(libres.length))];
    puntos.push(new Punto(celda.x * tileSize, celda.y * tileSize));
  }
}

// ====================== COLISIÓN RECTANGULAR ======================
function colisionRect(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}