// ====================== VARIABLES GLOBALES ======================
var rocaImg;
var puntoImg;
var playerImg;
var rocas = [];
var puntos = [];
var player = null;
var plat;
var tileSize = 50;

// ✅ Puntaje
var score = 0;

// ====================== PRELOAD ======================
function preload() {
  rocaImg = loadImage('assets/roca.png', () => console.log('✅ roca cargada'));
  puntoImg = loadImage('assets/cafe.jpg', () => console.log('✅ punto cargado'));

  // 🔥 Forzar tamaño pequeño del jugador al cargar
  playerImg = loadImage('assets/playerNuevo.png', img => {
    console.log('✅ jugador nuevo cargado');
    playerImg = img;
    playerImg.resize(20, 20); // 👈 fuerza tamaño real en memoria
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
      if (plat.plataform[i][j] === '*') {
        rocas.push(new Roca(j * tileSize, i * tileSize));
      }
    }
  }

  // Generar puntos (cafés)
  for (let i = 0; i < plat.filas; i++) {
    for (let j = 0; j < plat.columnas; j++) {
      if (plat.plataform[i][j] === 'o') {
        puntos.push(new Punto(j * tileSize, i * tileSize));
      }
    }
  }

  // Crear jugador donde la plataforma tenga 'p'
  for (let i = 0; i < plat.filas; i++) {
    for (let j = 0; j < plat.columnas; j++) {
      if (plat.plataform[i][j] === 'p') {
        player = new Jugador(j * tileSize, i * tileSize);
        console.log("Jugador creado en:", player.x, player.y);
      }
    }
  }
}

// ====================== DRAW ======================
function draw() {
  background(0);

  // Mostrar muros
  for (let r of rocas) {
    r.show();
  }

  // Mostrar puntos (cafés)
  for (let p of puntos) {
    p.show();
  }

  // Mostrar jugador
  if (player) {
    player.mover();
    player.show();
  }

  // Mostrar puntaje
  fill(255);
  textSize(20);
  text("Cafés: " + score, 10, 20);
}

// ====================== CLASE JUGADOR ======================
function Jugador(x, y) {
  this.x = x;
  this.y = y;
  this.velocidad = 4;
  this.width = 20;  // 🔥 tamaño visual pequeño
  this.height = 20;

  this.show = function() {
    if (playerImg) {
      image(playerImg, this.x, this.y, this.width, this.height);
    }
  }

  // ✅ MOVIMIENTO + COLISIONES
  this.mover = function() {
    let oldX = this.x;
    let oldY = this.y;

    // Movimiento
    if (keyIsDown(LEFT_ARROW))  this.x -= this.velocidad;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.velocidad;
    if (keyIsDown(UP_ARROW))    this.y -= this.velocidad;
    if (keyIsDown(DOWN_ARROW))  this.y += this.velocidad;

    // Colisión con rocas
    for (let r of rocas) {
      if (colisionRect(this, r)) {
        this.x = oldX;
        this.y = oldY;
      }
    }

    // Colisión con cafés
    for (let i = puntos.length - 1; i >= 0; i--) {
      if (colisionRect(this, puntos[i])) {
        score++;
        puntos.splice(i, 1);
        generarPuntoAleatorio();
      }
    }
  }
}

// ====================== FUNCIÓN GENERAR NUEVO CAFÉ ======================
function generarPuntoAleatorio() {
  let libres = [];

  for (let i = 0; i < plat.filas; i++) {
    for (let j = 0; j < plat.columnas; j++) {
      if (plat.plataform[i][j] === ' ') {  // espacio vacío
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
