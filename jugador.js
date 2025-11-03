// ====================== CLASE JUGADOR ======================
function Jugador(x, y) {
  this.x = x + 20;  // lo centra dentro del tile
  this.y = y + 20;
  this.velocidad = 4;

  // ✅ tamaño visual mucho más pequeño
  this.width = 20;  
  this.height = 20;

  this.show = function() {
    if (playerImg) {
      // la imagen se dibuja más pequeña aquí
      image(playerImg, this.x, this.y, this.width, this.height);
    } else {
      fill(0, 255, 0);
      rect(this.x, this.y, this.width, this.height);
    }
  };

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
  };
}
