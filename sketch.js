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
  puntoImg = loadImage('assets/cafe.jpg', () => console.log('✅ café cargado'));

  // 🔥 Cargar y redimensionar el jugador
  playerImg = loadImage('assets/playerNuevo.png', img => {
    console.log('✅ jugador nuevo cargado');
    playerImg = img;
    playerImg.resize(25, 25); // 👈 Tamaño ideal del jugador
  }, () => {
    console.error('❌ No se pudo cargar playerNuevo.png');
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
        console.log("✅ Jugador creado en:", player.x, player.y);
      }
    }
  }
}

// ====================== DRAW ======================
function draw() {
  background(0);

  // Mostrar muros
  for (let r of rocas) r.show();

  // Mostrar puntos (cafés)
  for (let p of puntos) p.show();

  // Mostrar jugador
  if (player) {
    player.mover();
    player.show();
  }

  // Mostrar puntaje
  fill(255);
  textSize(20);
  text("Cafés: " + score, 10, 25);
}

// ====================== FUNCIÓN GENERAR NUEVO CAFÉ ======================
function generarPuntoAleatorio() {
  let libres = [];

  for (let i = 0; i < plat.filas; i++) {
    for (let j = 0; j < plat.columnas; j++) {
      if (plat.plataform[i][j] === ' ') { // espacio vacío
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
