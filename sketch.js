var rocaImg;
var puntoImg;
var rocas = [];
var puntos = [];
var plat;
var tileSize = 50;

function preload() {
  rocaImg = loadImage(
    'assets/roca.png',
    () => console.log('✅ roca cargada'),
    () => console.log('❌ ERROR cargando roca')
  );

  puntoImg = loadImage(
    'assets/cafe.jpg',
    () => console.log('✅ punto cargado'),
    () => console.log('❌ ERROR cargando punto')
  );
}

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
