// ====================== CLASE ROCA ======================
function Roca(x, y) {
  this.x = x;
  this.y = y;
  this.width = 50;   // ✅ Tamaño para detectar colisión
  this.height = 50;

  // ======== DIBUJAR ROCA ========
  this.show = function() {
    if (rocaImg) {
      image(rocaImg, this.x, this.y, this.width, this.height);
    } else {
      fill(100, 100, 255);
      rect(this.x, this.y, this.width, this.height);
    }
  };
}
