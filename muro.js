function Roca(x, y) {
  this.x = x;
  this.y = y;

  this.show = function() {
    if (rocaImg) {
      image(rocaImg, this.x, this.y, 50, 50);
    } else {
      fill(100, 100, 255);
      rect(this.x, this.y, 50, 50);
    }
  }
}
