// ====================== CLASE ENEMIGO ======================
function Enemigo(x, y) {
  this.x = x + 20;
  this.y = y + 20;
  this.velocidad = 2.5;
  this.width = 20;
  this.height = 20;
  
  // ✅ Propiedades para IA y efectos visuales
  this.direccion = createVector(0, 0);
  this.ultimaActualizacion = 0;
  this.intervaloActualizacion = 30;
  this.pulse = 0;
  this.pulseDirection = 1;
  this.ojosPosiciones = [
    { x: -5, y: -3 },
    { x: 5, y: -3 }
  ];
  this.respiracion = 0;

  this.show = function() {
    // Efecto de pulso rojo más intenso
    this.pulse += 0.1 * this.pulseDirection;
    if (this.pulse > 0.6 || this.pulse < 0) {
      this.pulseDirection *= -1;
    }
    
    // Efecto de respiración/ritmo amenazante
    this.respiracion = sin(frameCount * 0.1) * 0.5;
    
    push();
    translate(this.x + this.width/2, this.y + this.height/2);
    
    // Efecto de aura roja MÁS FUERTE
    let auraIntensity = 20 + this.pulse * 15;
    drawingContext.shadowBlur = auraIntensity;
    drawingContext.shadowColor = color(255, 0, 0, 200);
    
    // Cuerpo del enemigo (rojo oscuro y amenazante)
    fill(150, 0, 0);
    rect(-this.width/2, -this.height/2, this.width, this.height, 5);
    
    // Patrón de "venas" rojas más claras
    fill(200, 50, 50);
    rect(-this.width/2 + 2, -this.height/2 + 2, this.width - 4, this.height - 4, 3);
    
    // Efecto de energía oscura interna
    fill(255, 50, 50, 60 + this.pulse * 40);
    rect(-this.width/2 + 4, -this.height/2 + 4, this.width - 8, this.height - 8, 2);
    
    // Ojos (siempre mirando al jugador intensamente)
    this.dibujarOjos();
    
    // Boca recta y amenazante
    this.dibujarBoca();
    
    // Cuernos/protuberancias amenazantes
    this.dibujarCuernos();
    
    pop();
    
    drawingContext.shadowBlur = 0;
  };

  // ✅ DIBUJAR OJOS DEL ENEMIGO (más intensos)
  this.dibujarOjos = function() {
    let angulo = 0;
    if (player && !gameOver) {
      angulo = atan2(player.y - this.y, player.x - this.x);
    }
    
    let distanciaOjo = 2 + this.respiracion;
    
    fill(255, 255, 0); // Ojos amarillos intensos
    for (let ojo of this.ojosPosiciones) {
      let ojoX = ojo.x + cos(angulo) * distanciaOjo;
      let ojoY = ojo.y + sin(angulo) * distanciaOjo;
      
      // Ojo principal más grande y penetrante
      ellipse(ojoX, ojoY, 7, 7);
      
      // Pupila negra más grande
      fill(0);
      ellipse(ojoX + cos(angulo) * 2, ojoY + sin(angulo) * 2, 4, 4);
      
      // Destello rojo siniestro
      fill(255, 0, 0, 100);
      ellipse(ojoX - 1, ojoY - 1, 2, 2);
      
      fill(255, 255, 0); // Reset para siguiente ojo
    }
  };

  // ✅ DIBUJAR BOCA AMENAZANTE
  this.dibujarBoca = function() {
    fill(100, 0, 0);
    
    // Boca rectangular fija (más amenazante)
    let alturaBoca = 3 + this.pulse * 1;
    rect(-4, 5, 8, alturaBoca, 1);
    
    // Dientes/patrón agresivo
    fill(200, 200, 200);
    for (let i = -3; i <= 3; i += 2) {
      rect(i, 5, 1, 2, 0.5);
    }
  };

  // ✅ DIBUJAR CUERNOS/PROTUBERANCIAS
  this.dibujarCuernos = function() {
    fill(120, 0, 0);
    
    // Cuerno izquierdo
    triangle(-6, -8, -3, -12, 0, -8);
    // Cuerno derecho
    triangle(6, -8, 3, -12, 0, -8);
    
    // Efecto de punta de los cuernos
    fill(200, 0, 0);
    triangle(-4.5, -11, -3, -12, -1.5, -11);
    triangle(4.5, -11, 3, -12, 1.5, -11);
  };

  // ... (el resto del código del enemigo se mantiene igual)
  this.mover = function() {
    if (gameOver) return;
    
    // Actualizar dirección periódicamente
    if (frameCount - this.ultimaActualizacion > this.intervaloActualizacion) {
      this.actualizarDireccion();
      this.ultimaActualizacion = frameCount;
    }
    
    let oldX = this.x;
    let oldY = this.y;
    
    // Aplicar movimiento
    this.x += this.direccion.x * this.velocidad;
    this.y += this.direccion.y * this.velocidad;
    
    // Colisión con rocas
    for (let r of rocas) {
      if (colisionRect(this, r)) {
        this.x = oldX;
        this.y = oldY;
        this.actualizarDireccion();
      }
    }
    
    // Colisión con jugador
    if (player && colisionRect(this, player)) {
      gameOver = true;
      createGameOverEffect();
    }
  };

  this.actualizarDireccion = function() {
    if (!player || gameOver) return;
    
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    
    let distancia = sqrt(dx * dx + dy * dy);
    if (distancia > 0) {
      this.direccion.x = (dx / distancia) * 0.8 + random(-0.2, 0.2);
      this.direccion.y = (dy / distancia) * 0.8 + random(-0.2, 0.2);
      
      let mag = sqrt(this.direccion.x * this.direccion.x + this.direccion.y * this.direccion.y);
      this.direccion.x /= mag;
      this.direccion.y /= mag;
    }
  };

  this.intentarTeleport = function() {
    if (gameOver) return;
    
    if (random(1000) < 2) {
      this.teleportAleatorio();
    }
  };

  this.teleportAleatorio = function() {
    let libres = [];
    
    for (let i = 0; i < plat.filas; i++) {
      for (let j = 0; j < plat.columnas; j++) {
        if (plat.platform[i][j] === ' ') {
          let posX = j * tileSize + 20;
          let posY = i * tileSize + 20;
          let distJugador = dist(posX, posY, player.x, player.y);
          
          if (distJugador > 200) {
            libres.push({ x: posX, y: posY });
          }
        }
      }
    }
    
    if (libres.length > 0) {
      let nuevaPos = random(libres);
      this.x = nuevaPos.x;
      this.y = nuevaPos.y;
      
      createTeleportEffect(this.x + this.width/2, this.y + this.height/2);
    }
  };
}

// ... (las funciones auxiliares se mantienen igual)