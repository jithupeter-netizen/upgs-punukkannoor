/* UPGS Punukkonnoor - Interactive Hero Slider Logic with Centenary Ribbon & Celebration */

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');

  // Ribbon elements
  const ribbon = document.getElementById('sliderCentenaryRibbon');
  const badgeWrapper = document.getElementById('ribbonBadgeWrapper');
  const shockwave = document.getElementById('ribbonShockwave');
  const toastMsg = document.getElementById('ribbonToastMsg');
  const canvas = document.getElementById('centenaryCelebrationCanvas');
  
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const autoPlayDelay = 6000; // 6 seconds per slide

  /* ========================================================
     Celebration Confetti Engine (Hardware-Accelerated 2D Canvas)
     ======================================================== */
  class CelebrationConfetti {
    constructor(canvasEl) {
      this.canvas = canvasEl;
      this.ctx = canvasEl ? canvasEl.getContext('2d') : null;
      this.particles = [];
      this.animationId = null;
      this.colors = ['#fbbf24', '#f59e0b', '#d97706', '#ef4444', '#dc2626', '#3b82f6', '#10b981', '#ec4899', '#ffffff'];
      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });
    }

    resize() {
      if (!this.canvas || !this.canvas.parentElement) return;
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }

    burst(originX, originY) {
      if (!this.ctx) return;
      this.resize();
      const particleCount = 85;
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 11;
        const shapeType = Math.random() > 0.4 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'star');
        this.particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed + (Math.random() * 3 + 1), // Gentle drift across slider
          vy: Math.sin(angle) * speed - (Math.random() * 4 + 2), // Upward burst bias
          size: Math.random() * 9 + 5,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 14,
          wobble: Math.random() * 10,
          wobbleSpeed: 0.08 + Math.random() * 0.12,
          life: 1,
          decay: 0.007 + Math.random() * 0.008,
          shape: shapeType
        });
      }

      if (!this.animationId) {
        this.animate();
      }
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        this.ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        this.ctx.lineTo(x, y);
        rot += step;
      }
      this.ctx.lineTo(cx, cy - outerRadius);
      this.ctx.closePath();
      this.ctx.fillStyle = color;
      this.ctx.fill();
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // Gravity
        p.vx *= 0.985; // Drag
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;
        p.life -= p.decay;

        if (p.life <= 0 || p.y > this.canvas.height + 30) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.life);
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        const scaleX = Math.cos(p.wobble);
        this.ctx.scale(scaleX, 1);

        if (p.shape === 'rect') {
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === 'circle') {
          this.ctx.fillStyle = p.color;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          this.drawStar(0, 0, 4, p.size / 2, p.size / 4, p.color);
        }

        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animationId = requestAnimationFrame(() => this.animate());
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.animationId = null;
      }
    }
  }

  const confetti = canvas ? new CelebrationConfetti(canvas) : null;

  /* ========================================================
     Commemorative Shockwave & Badge Pulse
     ======================================================== */
  function triggerShockwave(isCelebration = false) {
    if (shockwave) {
      shockwave.classList.remove('pulsing');
      void shockwave.offsetWidth; // Force reflow
      shockwave.classList.add('pulsing');
    }

    if (badgeWrapper) {
      badgeWrapper.style.transition = 'transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1)';
      badgeWrapper.style.transform = isCelebration
        ? 'scale(1.22) rotate(-8deg)'
        : 'scale(1.08) rotate(3deg)';
      setTimeout(() => {
        badgeWrapper.style.transform = 'scale(1) rotate(0deg)';
        setTimeout(() => {
          badgeWrapper.style.transition = '';
        }, 220);
      }, 200);
    }
  }

  /* ========================================================
     Slider Navigation & Progress Bar
     ======================================================== */
  function resetProgressBar() {
    const allProgress = document.querySelectorAll('.dot-progress');
    allProgress.forEach(p => {
      p.style.transition = 'none';
      p.style.width = '0%';
    });
    
    const activeProgress = dots[currentSlide].querySelector('.dot-progress');
    if (activeProgress) {
      setTimeout(() => {
        activeProgress.style.transition = `width ${autoPlayDelay}ms linear`;
        activeProgress.style.width = '100%';
      }, 30);
    }
  }

  function showSlide(index, fromUser = false) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    currentSlide = index;
    resetProgressBar();
    triggerShockwave(false);
  }

  function nextSlide() {
    const newIndex = (currentSlide + 1) % slides.length;
    showSlide(newIndex);
  }

  function prevSlide() {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(newIndex);
  }

  function startAutoPlay() {
    stopAutoPlay();
    resetProgressBar();
    slideInterval = setInterval(nextSlide, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
    const activeProgress = dots[currentSlide].querySelector('.dot-progress');
    if (activeProgress) {
      activeProgress.style.transition = 'none';
    }
  }

  // Event Listeners for Slider Controls
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index, true);
      startAutoPlay();
    });
  });

  // Pause on hover
  const heroContainer = document.querySelector('.fullwidth-hero-slider, .minimalist-hero-section');
  if (heroContainer && window.matchMedia('(hover: hover)').matches) {
    heroContainer.addEventListener('mouseenter', stopAutoPlay);
    heroContainer.addEventListener('mouseleave', startAutoPlay);
  }

  // Touch swipe gesture support for mobile devices
  if (heroContainer) {
    let touchStartX = 0;
    let touchEndX = 0;

    heroContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diffX = touchStartX - touchEndX;
      if (Math.abs(diffX) > 45) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        startAutoPlay();
      }
    }, { passive: true });
  }

  /* ========================================================
     Ribbon 3D Tilt & Celebration Click Event
     ======================================================== */
  if (ribbon && badgeWrapper) {
    // 3D perspective mouse tilt
    ribbon.addEventListener('mousemove', (e) => {
      const rect = ribbon.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = -(y / rect.height) * 20;
      const tiltY = (x / rect.width) * 20;
      badgeWrapper.style.transform = `perspective(600px) rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg) scale(1.06)`;
    });

    ribbon.addEventListener('mouseleave', () => {
      badgeWrapper.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    });

    // Celebration Click Reaction
    let toastTimer = null;
    function celebrate(e) {
      if (e) e.preventDefault();
      triggerShockwave(true);

      if (confetti && ribbon && ribbon.parentElement) {
        const rect = ribbon.getBoundingClientRect();
        const parentRect = ribbon.parentElement.getBoundingClientRect();
        const originX = rect.left - parentRect.left + rect.width / 2;
        const originY = rect.top - parentRect.top + rect.height / 2;
        confetti.burst(originX, originY);
      }

      if (toastMsg) {
        toastMsg.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toastMsg.classList.remove('show');
        }, 2800);
      }
    }

    ribbon.addEventListener('click', celebrate);
    ribbon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        celebrate(e);
      }
    });
  }

  // Initialize
  showSlide(0);
  startAutoPlay();
});
