// ====================== CLASE ROCA ======================
function Roca(x, y) {
  this.x = x;
  this.y = y;
  this.width = 50;
  this.height = 50;
  
  // ✅ Nuevas propiedades para efectos visuales
  this.textureOffset = random(1000);

  // ======== DIBUJAR ROCA ========
  this.show = function() {
    // Efecto de sombra
    drawingContext.shadowBlur = 8;
    drawingContext.shadowColor = color(0, 0, 0, 100);
    
    if (rocaImg) {
      image(rocaImg, this.x, this.y, this.width, this.height);
    } else {
      // Representación de respaldo con textura
      fill(80, 60, 40);
      rect(this.x, this.y, this.width, this.height, 5);
      
      // Efecto de textura
      this.drawTexture();
    }
    
    drawingContext.shadowBlur = 0;
  };
  
  // Dibujar textura para las rocas
  this.drawTexture = function() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let noiseVal = noise(this.textureOffset + i * 0.5, j * 0.5);
        let alpha = map(noiseVal, 0, 1, 30, 80);
        let size = map(noiseVal, 0, 1, 2, 6);
        
        fill(60, 40, 20, alpha);
        noStroke();
        ellipse(
          this.x + 10 + i * 15, 
          this.y + 10 + j * 15, 
          size, 
          size
        );
      }
    }
  };
}