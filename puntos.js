function Punto(x, y) {
  this.x = x;
  this.y = y;
  this.width = 50;
  this.height = 50;

  this.show = function() {
    if (puntoImg) {
      image(puntoImg, this.x, this.y, this.width, this.height);
    } else {
      fill(255, 200, 0);
      ellipse(this.x + 25, this.y + 25, 30, 30);
    }
  }
}
