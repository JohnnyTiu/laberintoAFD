function Punto(x, y) {
  this.x = x;
  this.y = y;
  this.width = 50;
  this.height = 50;
  this.pulse = 0;

  this.show = function() {
    this.pulse += 0.05;
    
    // Efecto de brillo
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(255, 200, 0, 150);
    
    // Círculo principal
    fill(255, 200, 0);
    ellipse(this.x + 25, this.y + 25, 30, 30);
    
    // Efecto de pulso
    fill(255, 230, 100, 100 + sin(this.pulse) * 50);
    ellipse(this.x + 25, this.y + 25, 25, 25);
    
    drawingContext.shadowBlur = 0;
  };
}