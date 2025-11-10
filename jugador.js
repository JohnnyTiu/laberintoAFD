function Jugador(x, y) {
  this.x = x + 15;
  this.y = y + 15;
  this.velocidad = 4;
  this.width = 20;
  this.height = 20;
  this.pulse = 0;

  this.show = function() {
    this.pulse += 0.05;
    
    push();
    translate(this.x + this.width/2, this.y + this.height/2);
    
    // Aura azul (solo si el juego está activo)
    if (!gameOver && !win) {
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = color(0, 100, 255, 150);
    }
    
    // Cuerpo azul según estado
    if (gameOver) {
      fill(100, 100, 150);
    } else if (win) {
      fill(100, 200, 255);
    } else {
      fill(0, 100, 200);
    }
    
    rect(-this.width/2, -this.height/2, this.width, this.height, 5);
    
    // Detalles internos
    if (gameOver) {
      fill(150, 150, 180);
    } else if (win) {
      fill(150, 230, 255);
    } else {
      fill(50, 150, 255);
    }
    rect(-this.width/2 + 3, -this.height/2 + 3, this.width - 6, this.height - 6, 3);
    
    // Ojos según estado
    if (gameOver) {
      stroke(40, 40, 80);
      strokeWeight(2);
      line(-7, -3, -3, -3);
      line(3, -3, 7, -3);
      noStroke();
    } else if (win) {
      fill(255, 255, 200);
      ellipse(-5, -3, 6, 6);
      ellipse(5, -3, 6, 6);
      fill(0, 80, 160);
      ellipse(-5, -2, 3, 3);
      ellipse(5, -2, 3, 3);
    } else {
      fill(200, 230, 255);
      ellipse(-5, -3, 6, 6);
      ellipse(5, -3, 6, 6);
      fill(0, 60, 120);
      ellipse(-5, -3, 3, 3);
      ellipse(5, -3, 3, 3);
    }
    
    // Boca según estado
    if (gameOver) {
      fill(40, 40, 80);
      arc(0, 7, 8, 4, PI, TWO_PI, CHORD);
    } else if (win) {
      fill(40, 80, 140);
      arc(0, 3, 10, 6, 0, PI, CHORD);
    } else {
      fill(40, 80, 140);
      arc(0, 5, 8, 4, 0, PI, CHORD);
    }
    
    pop();
    drawingContext.shadowBlur = 0;
  };

  this.mover = function() {
    if (gameOver || win) return;
    
    let oldX = this.x;
    let oldY = this.y;

    // Movimiento
    if (keyIsDown(LEFT_ARROW)) this.x -= this.velocidad;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.velocidad;
    if (keyIsDown(UP_ARROW)) this.y -= this.velocidad;
    if (keyIsDown(DOWN_ARROW)) this.y += this.velocidad;

    // Colisión con rocas
    for (let r of rocas) {
      if (colisionRect(this, r)) {
        this.x = oldX;
        this.y = oldY;
        break;
      }
    }

    // Colisión con cafés
    if (!win) {
      for (let i = puntos.length - 1; i >= 0; i--) {
        if (colisionRect(this, puntos[i])) {
          puntosRecolectados++; // ✅ Usar la variable del nivel
          createCollectionEffect(puntos[i].x, puntos[i].y);
          puntos.splice(i, 1);
          console.log("☕ Café recolectado! Progreso:", puntosRecolectados + "/" + totalPuntosNivel);
          break;
        }
      }
    }

    // Colisión con enemigos
    if (!gameOver && !win) {
      for (let e of enemigos) {
        if (colisionRect(this, e)) {
          gameOver = true;
          createGameOverEffect();
          console.log("💀 Game Over en nivel", nivelActual);
          break;
        }
      }
    }
  };
}