function Punto(x, y) {
  this.x = x;
  this.y = y;

  this.show = function() {
    if (puntoImg) {
      image(puntoImg, this.x, this.y, 50, 50);
    } else {
      fill(255, 200, 0);
      ellipse(this.x + 25, this.y + 25, 30, 30);
    }
  }
}
