// ====================== CLASE JUGADOR ======================
function Jugador(x, y) {
  this.x = x + 20;
  this.y = y + 20;
  this.velocidad = 4;

  // ✅ Tamaño del jugador
  this.width = 20;  
  this.height = 20;
  
  // ✅ Propiedades para efectos visuales
  this.direccion = createVector(0, 0);
  this.pulse = 0;
  this.pulseDirection = 1;
  this.ojosPosiciones = [
    { x: -5, y: -3 },
    { x: 5, y: -3 }
  ];
  this.bocaAnimacion = 0;
  this.bocaDireccion = 1;
  this.respiracion = 0;
  this.ultimaActualizacion = 0;

  this.show = function() {
    // Efecto de pulso azul
    this.pulse += 0.06 * this.pulseDirection;
    if (this.pulse > 0.5 || this.pulse < 0) {
      this.pulseDirection *= -1;
    }
    
    // Efecto de respiración suave
    this.respiracion = sin(frameCount * 0.08) * 0.3;
    
    // Animación de boca
    this.bocaAnimacion += 0.08 * this.bocaDireccion;
    if (this.bocaAnimacion > 2 || this.bocaAnimacion < 0) {
      this.bocaDireccion *= -1;
    }
    
    push();
    translate(this.x + this.width/2, this.y + this.height/2);
    
    // Efecto de aura azul (diferente al rojo del enemigo)
    let auraIntensity = 15 + this.pulse * 10;
    drawingContext.shadowBlur = auraIntensity;
    drawingContext.shadowColor = color(0, 100, 255, 180);
    
    // ======== CUERPO PRINCIPAL ========
    // Cuerpo base (azul heroico)
    fill(0, 80, 180);
    rect(-this.width/2, -this.height/2, this.width, this.height, 6);
    
    // Detalle interno (azul más claro)
    fill(30, 120, 220);
    rect(-this.width/2 + 2, -this.height/2 + 2, this.width - 4, this.height - 4, 4);
    
    // Efecto de energía interna
    fill(60, 160, 255, 60 + this.pulse * 40);
    rect(-this.width/2 + 4, -this.height/2 + 4, this.width - 8, this.height - 8, 2);
    
    // ======== OJOS ========
    this.dibujarOjos();
    
    // ======== BOCA ========
    this.dibujarBoca();
    
    // ======== DETALLES ÚNICOS ========
    this.dibujarDetalles();
    
    pop();
    
    // Resetear efectos de sombra
    drawingContext.shadowBlur = 0;
  };

  // ✅ DIBUJAR OJOS DEL JUGADOR
  this.dibujarOjos = function() {
    let angulo = 0;
    
    // Los ojos del jugador siguen la dirección del movimiento
    if (frameCount - this.ultimaActualizacion > 10) {
      if (keyIsDown(LEFT_ARROW)) this.direccion.x = -1;
      else if (keyIsDown(RIGHT_ARROW)) this.direccion.x = 1;
      else this.direccion.x = 0;
      
      if (keyIsDown(UP_ARROW)) this.direccion.y = -1;
      else if (keyIsDown(DOWN_ARROW)) this.direccion.y = 1;
      else this.direccion.y = 0;
      
      this.ultimaActualizacion = frameCount;
    }
    
    // Normalizar dirección
    if (this.direccion.x !== 0 || this.direccion.y !== 0) {
      let mag = sqrt(this.direccion.x * this.direccion.x + this.direccion.y * this.direccion.y);
      angulo = atan2(this.direccion.y, this.direccion.x);
    }
    
    let distanciaOjo = 1.5 + this.respiracion;
    
    fill(200, 230, 255); // Ojos azul claro brillante
    
    for (let ojo of this.ojosPosiciones) {
      let ojoX = ojo.x + cos(angulo) * distanciaOjo;
      let ojoY = ojo.y + sin(angulo) * distanciaOjo;
      
      // Ojo principal
      ellipse(ojoX, ojoY, 6, 6);
      
      // Pupila (azul oscuro - diferente a la negra del enemigo)
      fill(0, 60, 120);
      ellipse(ojoX + cos(angulo) * 1.2, ojoY + sin(angulo) * 1.2, 3, 3);
      
      // Destello blanco (más prominente que el del enemigo)
      fill(255, 255, 255);
      ellipse(ojoX - 1, ojoY - 1, 2, 2);
      
      fill(200, 230, 255); // Reset para siguiente ojo
    }
  };

  // ✅ DIBUJAR BOCA DEL JUGADOR
  this.dibujarBoca = function() {
    // Boca sonriente (diferente a la recta del enemigo)
    fill(40, 80, 140);
    
    if (puntos.length > 2) {
      // Sonrisa amplia cuando hay muchos cafés
      arc(0, 6, 8, 3 + this.bocaAnimacion, 0, PI, CHORD);
    } else {
      // Sonrisa más pequeña cuando quedan pocos cafés
      arc(0, 6, 6, 2 + this.bocaAnimacion, 0, PI, CHORD);
    }
    
    // Efecto de "hablar" cuando se mueve
    if ((keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || 
         keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW)) && 
        frameCount % 20 < 10) {
      fill(80, 140, 200);
      rect(-2, 5, 4, 2, 1);
    }
  };

  // ✅ DIBUJAR DETALLES ADICIONALES DEL JUGADOR
  this.dibujarDetalles = function() {
    // Antena/sensor en la cabeza (único del jugador)
    fill(30, 120, 220);
    rect(-1, -this.height/2 - 4, 2, 5, 1);
    
    // Luz de la antena (parpadea)
    fill(100, 200, 255, 150 + sin(frameCount * 0.2) * 100);
    ellipse(0, -this.height/2 - 6, 3, 3);
    
    // Patrones de circuitos en el cuerpo
    stroke(100, 180, 255, 120);
    strokeWeight(1);
    noFill();
    
    // Circuito superior
    arc(0, -4, 6, 4, PI, TWO_PI);
    // Circuito inferior
    arc(0, 4, 6, 4, 0, PI);
    
    // Líneas verticales de conexión
    line(0, -2, 0, 2);
    
    noStroke();
    
    // Marcas/círculos en los costados
    fill(40, 100, 200);
    ellipse(-this.width/2 + 2, 0, 2, 2);
    ellipse(this.width/2 - 2, 0, 2, 2);
    
    // Efecto de partículas de energía (solo cuando se mueve)
    if ((keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || 
         keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW)) && 
        random() > 0.7) {
      fill(100, 200, 255, 150);
      let angle = random(TWO_PI);
      let dist = random(10, 15);
      ellipse(
        cos(angle) * dist,
        sin(angle) * dist,
        random(1, 2),
        random(1, 2)
      );
    }
  };

  // ✅ MOVIMIENTO + COLISIONES
  this.mover = function() {
    // No mover si el juego terminó
    if (gameOver) return;
    
    let oldX = this.x;
    let oldY = this.y;

    // Movimiento
    if (keyIsDown(LEFT_ARROW))  this.x -= this.velocidad;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.velocidad;
    if (keyIsDown(UP_ARROW))    this.y -= this.velocidad;
    if (keyIsDown(DOWN_ARROW))  this.y += this.velocidad;

    // Colisión con rocas
    for (let r of rocas) {
      if (colisionRect(this, r)) {
        this.x = oldX;
        this.y = oldY;
        createCollisionEffect(this.x + this.width/2, this.y + this.height/2);
      }
    }

    // Colisión con cafés
    for (let i = puntos.length - 1; i >= 0; i--) {
      if (colisionRect(this, puntos[i])) {
        score++;
        createCollectionEffect(puntos[i].x, puntos[i].y);
        puntos.splice(i, 1);
        generarPuntoAleatorio();
        
        // Efecto especial de energía azul al recolectar
        this.crearEfectoRecoleccion();
      }
    }
  };

  // ✅ EFECTO ESPECIAL AL RECOLECTAR CAFÉ
  this.crearEfectoRecoleccion = function() {
    for (let i = 0; i < 8; i++) {
      let angle = random(TWO_PI);
      let speed = random(1.5, 3);
      collectedParticles.push({
        x: this.x + this.width/2,
        y: this.y + this.height/2,
        size: random(2, 4),
        speedX: cos(angle) * speed,
        speedY: sin(angle) * speed,
        alpha: 200,
        color: color(0, 150, 255) // Partículas azules
      });
    }
  };
}

// Efecto visual de colisión (azul para el jugador)
function createCollisionEffect(x, y) {
  for (let i = 0; i < 6; i++) {
    collectedParticles.push({
      x: x,
      y: y,
      size: random(3, 5),
      speedX: random(-2, 2),
      speedY: random(-2, 2),
      alpha: 180,
      color: color(0, 100, 200) // Azul en lugar de rojo
    });
  }
}