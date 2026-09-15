let particles = [];
let currentSlide = 0; // Controla el comportamiento según la diapositiva

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-particulas'); // Se monta en el div que dejamos atrás en el HTML
  
  // Creamos un pool inicial de partículas (jóvenes, viejas y del fórum)
  for (let i = 0; i < 300; i++) {
    particles.push(new Particle());
  }

  // Escuchamos cuando Reveal.js cambia de slide
  Reveal.addEventListener('slidechanged', (event) => {
    currentSlide = event.indexh; // event.indexh nos da el número de la diapositiva (0 a 12)
    console.log("Cambiamos a la slide:", currentSlide);
  });
}

function draw() {
  background(10, 10, 15, 25); // Efecto de estela suave (motion blur)
  
  for (let p of particles) {
    p.update(currentSlide);
    p.display();
  }
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.acc = createVector(0, 0);
    this.tipo = random(['joven', 'vieja', 'forum']); // Tipos iniciales
    this.radio = 6;
    this.crecida = false;
  }

  update(slide) {
    // Aquí es donde aplicamos la lógica dependiendo de la diapositiva (slide)
    switch(slide) {
      case 0: // Slide 1: Jóvenes y viejas aisladas
        this.comportamientoSlide1();
        break;
      case 1: // Slide 2: Jóvenes pasan por el fórum, mutan y mueren
        this.comportamientoSlide2();
        break;
      // ... y así nos vamos con cada caso
      default:
        this.movimientoLibre();
        break;
    }

    this.vel.add(this.acc);
    this.vel.limit(4);
    this.pos.add(this.vel);
    this.acc.mult(0); // Limpiar aceleración
    this.revisarBordes();
  }

  comportamientoSlide1() {
    // Lógica para que las jóvenes (verde limón) y viejas (grises) floten separadas
    if (this.tipo === 'joven') {
      fill(50, 255, 100); // Verde limón
    } else {
      fill(150, 150, 150); // Gris
    }
    this.movimientoLibre();
  }

  comportamientoSlide2() {
    // Ejemplo: atracción hacia el centro (fórum) y cambio de estado
    let centro = createVector(width / 2, height / 2);
    let fuerza = p5.Vector.sub(centro, this.pos);
    fuerza.setMag(0.5);
    this.acc.add(fuerza);
    
    // Si llegan al centro, cambian a viejas
    if (this.pos.dist(centro) < 50 && this.tipo === 'joven') {
      this.tipo = 'vieja';
    }
  }

  movimientoLibre() {
    let wander = p5.Vector.random2D().mult(0.2);
    this.acc.add(wander);
  }

  display() {
    noStroke();
    if (this.tipo === 'joven') fill(57, 255, 20); // Verde limón intenso
    else if (this.tipo === 'vieja') fill(120, 120, 120); // Gris
    else fill(220, 40, 40); // Rojo Fórum
    
    ellipse(this.pos.x, this.pos.y, this.radio * 2);
  }

  revisarBordes() {
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
