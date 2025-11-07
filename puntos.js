function Punto(x, y) {
  this.x = x;
  this.y = y;
  this.width = 50;
  this.height = 50;
  
  // ✅ Nuevas propiedades para efectos visuales
  this.pulse = 0;
  this.pulseSpeed = 0.05;
  this.rotation = 0;
  this.floatOffset = random(0, TWO_PI);

  this.show = function() {
    // Efectos de animación
    this.pulse += this.pulseSpeed;
    this.rotation += 0.02;
    let floatY = sin(frameCount * 0.05 + this.floatOffset) * 2;
    
    push();
    
    // Trasladar al centro del punto para rotación
    translate(this.x + this.width/2, this.y + this.height/2 + floatY);
    rotate(this.rotation);
    
    if (puntoImg) {
      // Efecto de brillo
      drawingContext.shadowBlur = 15;
      drawingContext.shadowColor = color(255, 200, 0, 150);
      
      // Dibujar imagen con efectos
      let pulseSize = 1 + sin(this.pulse) * 0.1;
      imageMode(CENTER);
      image(puntoImg, 0, 0, this.width * pulseSize, this.height * pulseSize);
      
      drawingContext.shadowBlur = 0;
    } else {
      // Representación de respaldo con efectos
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = color(255, 200, 0, 200);
      
      // Círculo principal
      fill(255, 200, 0);
      ellipse(0, 0, 30, 30);
      
      // Efecto de brillo interno
      fill(255, 230, 100);
      ellipse(0, 0, 20, 20);
      
      // Destello
      fill(255, 255, 200, 100 + sin(this.pulse * 2) * 50);
      ellipse(0, 0, 25, 25);
      
      drawingContext.shadowBlur = 0;
    }
    
    pop();
  }
}