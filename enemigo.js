function Enemigo(x, y) {
  this.x = x + 15;
  this.y = y + 15;
  this.velocidad = 2;
  this.width = 20;
  this.height = 20;
  
  // ✅ SISTEMA DE ESTADOS
  this.estado = "PATRULLAR"; // PATRULLAR, ALERTA, PERSEGUIR, REGRESAR
  this.estadoAnterior = "PATRULLAR";
  this.tiempoEstado = 0;
  this.ultimaActualizacion = 0;
  
  // ✅ PROPIEDADES DE ESTADOS MEJORADAS
  this.posicionInicial = { x: this.x, y: this.y };
  this.areaPatrulla = 150; // Radio del área de patrulla
  this.direccion = createVector(random(-1, 1), random(-1, 1)).normalize();
  this.tiempoCambioDireccion = 0;
  this.intervaloCambioDireccion = 90; // Cambia dirección cada 1.5 segundos aprox
  this.ultimaVistaJugador = { x: 0, y: 0 };
  this.tiempoSinVerJugador = 0;
  
  // ✅ CONFIGURACIONES
  this.distanciaVision = 200;  // Distancia para detectar jugador
  this.distanciaPersecucion = 400; // Distancia máxima para perseguir
  this.tiempoAlerta = 60;      // Frames en estado ALERTA antes de perseguir (más rápido)
  this.tiempoRegreso = 180;    // Frames para regresar a posición inicial

  this.show = function() {
    push();
    translate(this.x + this.width/2, this.y + this.height/2);
    
    // ✅ COLOR SEGÚN ESTADO
    let colorCuerpo, colorOjos, colorAura;
    
    switch(this.estado) {
      case "PATRULLAR":
        colorCuerpo = color(150, 0, 0);     // Rojo oscuro
        colorOjos = color(200, 200, 0);     // Amarillo apagado
        colorAura = color(255, 0, 0, 50);   // Aura tenue
        break;
      case "ALERTA":
        colorCuerpo = color(200, 100, 0);   // Naranja
        colorOjos = color(255, 255, 100);   // Amarillo brillante
        colorAura = color(255, 150, 0, 100); // Aura naranja
        break;
      case "PERSEGUIR":
        colorCuerpo = color(220, 0, 0);     // Rojo intenso
        colorOjos = color(255, 50, 50);     // Rojo brillante
        colorAura = color(255, 0, 0, 150);  // Aura roja intensa
        break;
      case "REGRESAR":
        colorCuerpo = color(100, 0, 50);    // Morado oscuro
        colorOjos = color(150, 0, 100);     // Morado
        colorAura = color(150, 0, 100, 80); // Aura morada
        break;
    }
    
    // Aura según estado
    if (!gameOver && !win && !juegoPausado) {
      drawingContext.shadowBlur = 15;
      drawingContext.shadowColor = colorAura;
    }
    
    // Cuerpo
    if (gameOver || win) {
      fill(100, 0, 0);
    } else {
      fill(colorCuerpo);
    }
    rect(-this.width/2, -this.height/2, this.width, this.height, 5);
    
    // Detalles internos
    if (gameOver || win) {
      fill(80, 0, 0);
    } else {
      fill(red(colorCuerpo) - 50, green(colorCuerpo) - 50, blue(colorCuerpo) - 50);
    }
    rect(-this.width/2 + 2, -this.height/2 + 2, this.width - 4, this.height - 4, 3);
    
    // Ojos según estado
    if (gameOver) {
      fill(150, 150, 0);
    } else if (win) {
      fill(100, 100, 0);
    } else {
      fill(colorOjos);
    }
    
    // ✅ ANIMACIÓN DE OJOS SEGÚN ESTADO
    let tamanoOjos = 7;
    let animacionOjos = 0;
    
    if (this.estado === "ALERTA") {
      // Ojos parpadeantes en alerta
      animacionOjos = sin(frameCount * 0.3) * 1.5;
      tamanoOjos += animacionOjos;
    } else if (this.estado === "PERSEGUIR") {
      // Ojos muy abiertos en persecución
      tamanoOjos = 8;
    }
    
    ellipse(-5, -3, tamanoOjos, tamanoOjos);
    ellipse(5, -3, tamanoOjos, tamanoOjos);
    
    // Pupilas (seguen al jugador en algunos estados)
    fill(0);
    let offsetPupilaX = 0;
    let offsetPupilaY = 0;
    
    if ((this.estado === "ALERTA" || this.estado === "PERSEGUIR") && player && !gameOver && !win) {
      let angulo = atan2(player.y - this.y, player.x - this.x);
      offsetPupilaX = cos(angulo) * 1.5;
      offsetPupilaY = sin(angulo) * 1.5;
    }
    
    ellipse(-5 + offsetPupilaX, -3 + offsetPupilaY, 4, 4);
    ellipse(5 + offsetPupilaX, -3 + offsetPupilaY, 4, 4);
    
    // ✅ BOCA SEGÚN ESTADO
    if (gameOver || win) {
      fill(60, 0, 0);
    } else {
      switch(this.estado) {
        case "PATRULLAR":
          fill(80, 0, 0);
          rect(-3, 5, 6, 2, 1); // Boca pequeña
          break;
        case "ALERTA":
          fill(100, 50, 0);
          rect(-4, 5, 8, 2, 1); // Boca media
          break;
        case "PERSEGUIR":
          fill(120, 0, 0);
          rect(-4, 4, 8, 3, 1); // Boca grande
          // Dientes en persecución
          fill(255, 255, 255);
          rect(-3, 4, 2, 1, 0.5);
          rect(1, 4, 2, 1, 0.5);
          break;
        case "REGRESAR":
          fill(70, 0, 35);
          arc(0, 6, 6, 3, PI, TWO_PI, CHORD); // Boca triste
          break;
      }
    }
    
    // ✅ INDICADOR VISUAL DE ESTADO (círculo pequeño arriba)
    if (!gameOver && !win) {
      fill(colorOjos);
      noStroke();
      ellipse(0, -this.height/2 - 5, 4, 4);
    }
    
    pop();
    drawingContext.shadowBlur = 0;
  };

  this.mover = function() {
    if (gameOver || win || juegoPausado) return;
    
    this.tiempoEstado++;
    let oldX = this.x;
    let oldY = this.y;
    
    // ✅ MAQUINA DE ESTADOS MEJORADA
    switch(this.estado) {
      case "PATRULLAR":
        this.patrullar();
        break;
      case "ALERTA":
        this.alerta();
        break;
      case "PERSEGUIR":
        this.perseguir();
        break;
      case "REGRESAR":
        this.regresar();
        break;
    }
    
    // Aplicar movimiento
    this.x += this.direccion.x * this.velocidad;
    this.y += this.direccion.y * this.velocidad;
    
    // Colisión con rocas
    for (let r of rocas) {
      if (colisionRect(this, r)) {
        this.x = oldX;
        this.y = oldY;
        this.cambiarDireccionAleatoria();
        break;
      }
    }
    
    // Colisión con jugador
    if (!gameOver && !win && colisionRect(this, player)) {
      gameOver = true;
      createGameOverEffect();
      console.log("💀 Game Over por colisión con enemigo");
    }
  };

  // ✅ ESTADO: PATRULLAR MEJORADO
  this.patrullar = function() {
    // Cambiar dirección aleatoriamente periódicamente
    if (frameCount - this.tiempoCambioDireccion > this.intervaloCambioDireccion) {
      this.cambiarDireccionAleatoria();
      this.tiempoCambioDireccion = frameCount;
    }
    
    // Si se aleja demasiado del área de patrulla, corregir dirección
    let distanciaDesdeInicio = this.distanciaDesdeInicio();
    if (distanciaDesdeInicio > this.areaPatrulla) {
      let dx = this.posicionInicial.x - this.x;
      let dy = this.posicionInicial.y - this.y;
      let dist = sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        this.direccion.x = dx / dist * 0.7 + this.direccion.x * 0.3;
        this.direccion.y = dy / dist * 0.7 + this.direccion.y * 0.3;
        this.direccion.normalize();
      }
    }
    
    // Transición: PATRULLAR → ALERTA (jugador en visión)
    if (this.jugadorEnVision()) {
      this.cambiarEstado("ALERTA");
    }
  };

  // ✅ ESTADO: ALERTA MEJORADO (SE MUEVE LENTAMENTE HACIA EL JUGADOR)
  this.alerta = function() {
    if (player) {
      // Moverse lentamente hacia el jugador mientras está en alerta
      let dx = player.x - this.x;
      let dy = player.y - this.y;
      let dist = sqrt(dx * dx + dy * dy);
      
      if (dist > 0) {
        // Movimiento más lento que en persecución
        this.direccion.x = dx / dist * 0.5;
        this.direccion.y = dy / dist * 0.5;
      }
    }
    
    // Transiciones:
    if (!this.jugadorEnVision()) {
      // ALERTA → PATRULLAR (jugador desaparece)
      this.cambiarEstado("PATRULLAR");
    } else if (this.tiempoEstado > this.tiempoAlerta) {
      // ALERTA → PERSEGUIR (tiempo de alerta completado)
      this.cambiarEstado("PERSEGUIR");
    }
  };

  // ✅ ESTADO: PERSEGUIR COMPLETAMENTE CORREGIDO
  this.perseguir = function() {
    // Perseguir al jugador agresivamente
    if (player) {
      let dx = player.x - this.x;
      let dy = player.y - this.y;
      let dist = sqrt(dx * dx + dy * dy);
      
      if (dist > 0) {
        this.direccion.x = dx / dist;
        this.direccion.y = dy / dist;
        this.ultimaVistaJugador = { x: player.x, y: player.y };
      }
    }
    
    // ✅ VERIFICAR VISIÓN Y ACTUALIZAR CONTADOR (CORREGIDO)
    let puedeVerJugador = this.jugadorEnVision();
    
    if (puedeVerJugador) {
      // Resetear contador si puede ver al jugador
      this.tiempoSinVerJugador = 0;
    } else {
      // Incrementar contador si no puede ver al jugador
      this.tiempoSinVerJugador++;
    }
    
    // ✅ TRANSICIONES DESDE PERSEGUIR (CORREGIDAS)
    let distanciaDesdeInicio = this.distanciaDesdeInicio();
    
    // Transición por tiempo sin ver jugador
    if (this.tiempoSinVerJugador > 45) {
      this.cambiarEstado("REGRESAR");
      console.log("↩️ PERSEGUIR → REGRESAR: Sin ver jugador por " + this.tiempoSinVerJugador + " frames");
      return;
    }
    
    // Transición por distancia excesiva
    if (distanciaDesdeInicio > this.distanciaPersecucion) {
      this.cambiarEstado("REGRESAR");
      console.log("↩️ PERSEGUIR → REGRESAR: Demasiado lejos (" + distanciaDesdeInicio.toFixed(1) + "px > " + this.distanciaPersecucion + "px)");
      return;
    }
  };

  // ✅ ESTADO: REGRESAR MEJORADO
  this.regresar = function() {
    // Regresar a posición inicial
    let dx = this.posicionInicial.x - this.x;
    let dy = this.posicionInicial.y - this.y;
    let dist = sqrt(dx * dx + dy * dy);
    
    if (dist > 0) {
      this.direccion.x = dx / dist;
      this.direccion.y = dy / dist;
    }
    
    // Transición: REGRESAR → PATRULLAR (llegó a posición inicial)
    if (dist < 15) { // Cerca de la posición inicial
      this.cambiarEstado("PATRULLAR");
      this.cambiarDireccionAleatoria(); // Nueva dirección al regresar
    }
    
    // Transición: REGRESAR → ALERTA (jugador reaparece durante el regreso)
    if (this.jugadorEnVision()) {
      this.cambiarEstado("ALERTA");
    }
  };

  // ✅ FUNCIONES AUXILIARES MEJORADAS
  this.jugadorEnVision = function() {
    if (!player || gameOver || win) return false;
    
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    let distancia = sqrt(dx * dx + dy * dy);
    
    // Verificar distancia
    if (distancia > this.distanciaVision) return false;
    
    // Verificar línea de visión (sin muros en medio)
    return this.lineaDeVisionLibre();
  };

  this.lineaDeVisionLibre = function() {
    try {
      if (!player) return false;
      
      // Verificación mejorada de línea de visión
      let pasos = 20; // Más pasos para mejor precisión
      let visionBloqueada = false;
      
      for (let i = 1; i <= pasos; i++) {
        let t = i / pasos;
        let checkX = lerp(this.x + this.width/2, player.x + player.width/2, t);
        let checkY = lerp(this.y + this.height/2, player.y + player.height/2, t);
        
        // Verificar colisión con cada roca
        for (let r of rocas) {
          if (r && colisionRect({x: checkX, y: checkY, width: 8, height: 8}, r)) {
            visionBloqueada = true;
            break;
          }
        }
        
        if (visionBloqueada) break;
      }
      
      return !visionBloqueada;
    } catch (error) {
      console.error("❌ Error en lineaDeVisionLibre:", error);
      return false;
    }
  };

  this.distanciaDesdeInicio = function() {
    let dx = this.x - this.posicionInicial.x;
    let dy = this.y - this.posicionInicial.y;
    return sqrt(dx * dx + dy * dy);
  };

  this.cambiarDireccionAleatoria = function() {
    // Dirección más natural con tendencia a continuar
    let nuevaDir = createVector(random(-1, 1), random(-1, 1));
    // Suavizar el cambio manteniendo algo de la dirección anterior
    this.direccion.x = this.direccion.x * 0.3 + nuevaDir.x * 0.7;
    this.direccion.y = this.direccion.y * 0.3 + nuevaDir.y * 0.7;
    this.direccion.normalize();
  };

  this.cambiarEstado = function(nuevoEstado) {
    if (this.estado !== nuevoEstado) {
      let estadoAnterior = this.estado;
      this.estadoAnterior = estadoAnterior;
      this.estado = nuevoEstado;
      this.tiempoEstado = 0;
      this.tiempoSinVerJugador = 0;
      
      // Reiniciar timer de cambio de dirección al cambiar de estado
      this.tiempoCambioDireccion = frameCount;
      
      // ✅ REGISTRAR CAMBIO EN EL DIAGRAMA
      if (typeof registrarCambioEstado === 'function') {
        registrarCambioEstado(this, estadoAnterior, nuevoEstado);
      }
    }
  };
}