function Roca(x, y) {
  this.x = x;
  this.y = y;
  this.width = 50;
  this.height = 50;

  this.show = function() {
    // Color base marrón
    fill(100, 80, 60);
    stroke(70, 50, 30);
    strokeWeight(2);
    
    // Rectángulo con bordes redondeados
    rect(this.x, this.y, this.width, this.height, 5);
    
    // Textura simple
    stroke(70, 50, 30);
    strokeWeight(1);
    line(this.x + 15, this.y + 10, this.x + 15, this.y + 40);
    line(this.x + 10, this.y + 25, this.x + 40, this.y + 25);
    
    noStroke();
  };
}