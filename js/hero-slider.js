/* UPGS Punukkannoor - Interactive Hero Slider Logic with Progress Bar */

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');
  
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const autoPlayDelay = 6000; // 6 seconds per slide

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

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    currentSlide = index;
    resetProgressBar();
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

  // Event Listeners
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
      showSlide(index);
      startAutoPlay();
    });
  });

  // Pause on hover (only for devices that support hover, e.g. desktop)
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

  // Initialize
  showSlide(0);
  startAutoPlay();
});
