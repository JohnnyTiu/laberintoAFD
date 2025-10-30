// creacion de variables globales
var rocaImg;
var puntoImg;
var rocas = [];
var puntos = [];
var plat;
var tileSize = 50;

// precarga de imagenes
function preload() {
  // Cargar imagen de roca (muro)
  rocaImg = loadImage(
    'assets/roca.png',
    () => console.log('✅ roca cargada'),
    () => console.log('❌ ERROR cargando roca')
  );
  // Cargar imagen de punto (café)
  puntoImg = loadImage(
    'assets/cafe.jpg',
    () => console.log('✅ punto cargado'),
    () => console.log('❌ ERROR cargando punto')
  );
}
// configuracion inicial
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

  // Generar puntos (objetos recolectables)
  for (let i = 0; i < plat.filas; i++) {
    for (let j = 0; j < plat.columnas; j++) {
      if (plat.plataform[i][j] === 'o') {
        puntos.push(new Punto(j * tileSize, i * tileSize));
      }
    }
  }
}
// bucle principal
function draw() {
  background(0);

  // Mostrar muros
  for (let r of rocas) {
    r.show();
  }

  // Mostrar puntos
  for (let p of puntos) {
    p.show();
  }
}
