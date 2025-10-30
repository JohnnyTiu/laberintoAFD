// definicion de la clase Roca (muro)
function Roca(x, y) {
  this.x = x;
  this.y = y;
  // metodo para mostrar la roca
  this.show = function() {
    if (rocaImg) {
      image(rocaImg, this.x, this.y, 50, 50);
    } else {
      fill(100, 100, 255);
      rect(this.x, this.y, 50, 50);
    }
  }
}
