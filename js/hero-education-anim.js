/* UPGS Punukkannoor - Premium Interactive Floating Study & Letters Canvas + 3D Flip Book */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Floating Study Symbols & Letters Canvas Background
  const heroSection = document.querySelector('.minimalist-hero-section');
  if (!heroSection) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'hero-letters-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  canvas.style.opacity = '0.75';
  heroSection.insertBefore(canvas, heroSection.firstChild);

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: -1000, y: -1000, radius: 120 };

  const symbols = [
    'അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ക', 'ഖ', 'ഗ', 'മ', 'ല',
    'A', 'B', 'C', '1', '9', '2', '6',
    'π', '√', '∑', '∞',
    '📖', '🎓', '✏️', '✨', '💡'
  ];

  const colors = [
    'rgba(30, 58, 138, ',   // Deep Navy
    'rgba(37, 99, 235, ',   // Accent Blue
    'rgba(217, 119, 6, ',   // Amber/Gold
    'rgba(225, 29, 72, ',   // Coral
    'rgba(16, 185, 129, '   // Emerald
  ];

  function resize() {
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
    initParticles();
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.char = symbols[Math.floor(Math.random() * symbols.length)];
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.fontSize = Math.floor(Math.random() * 14) + 14; // 14px to 28px
      this.baseAlpha = Math.random() * 0.35 + 0.15;
      this.alpha = this.baseAlpha;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.4 + 0.2); // Slowly floating upwards
      this.rotation = (Math.random() - 0.5) * 0.3;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.01;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.angularSpeed;

      // Wrap around edges
      if (this.y < -30) {
        this.y = height + 20;
        this.x = Math.random() * width;
      }
      if (this.x < -30) this.x = width + 20;
      if (this.x > width + 30) this.x = -20;

      // Mouse repulsion and glow effect
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 3;
        this.y -= Math.sin(angle) * force * 3;
        this.alpha = Math.min(0.9, this.baseAlpha + force * 0.5);
      } else {
        this.alpha += (this.baseAlpha - this.alpha) * 0.05;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.font = `${this.fontSize}px 'Outfit', 'Inter', sans-serif`;
      ctx.fillStyle = this.colorBase + this.alpha + ')';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.char, 0, 0);
      ctx.restore();
    }
  }

  function initParticles() {
    const particleCount = Math.floor((width * height) / 18000);
    particles = [];
    for (let i = 0; i < Math.min(particleCount, 45); i++) {
      particles.push(new Particle());
    }
  }

  window.addEventListener('resize', resize);
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  heroSection.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();

  // 2. Interactive 3D Flip Book Page Turning Logic
  const flipBook = document.getElementById('hero-flip-book');
  if (flipBook) {
    let currentPage = 0;
    const pages = flipBook.querySelectorAll('.book-page');
    
    flipBook.addEventListener('click', () => {
      if (pages.length === 0) return;
      pages[currentPage].classList.toggle('flipped');
      currentPage = (currentPage + 1) % pages.length;
      
      if (currentPage === 0) {
        // Reset all pages after full loop
        setTimeout(() => {
          pages.forEach(p => p.classList.remove('flipped'));
        }, 600);
      }
    });
  }
});
