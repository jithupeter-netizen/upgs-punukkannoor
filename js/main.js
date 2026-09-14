/* UPGS Punukkannoor - Main Interactive Script */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    const closeNavMenu = () => {
      navMenu.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
      // Reset dropdown open states when main menu closes
      const dropdowns = navMenu.querySelectorAll('.nav-item-dropdown');
      dropdowns.forEach((d) => d.classList.remove('open', 'active'));
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
      }
      if (!isActive) {
        const dropdowns = navMenu.querySelectorAll('.nav-item-dropdown');
        dropdowns.forEach((d) => d.classList.remove('open', 'active'));
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeNavMenu();
      }
    });

    // Close menu when regular links (not dropdown toggles) are clicked
    const menuLinks = navMenu.querySelectorAll('a:not(.nav-item-dropdown > a)');
    menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeNavMenu();
      });
    });

    // Mobile Dropdown Accordion Toggle (only on mobile <= 992px)
    const dropdownParents = navMenu.querySelectorAll('.nav-item-dropdown');
    dropdownParents.forEach((dropdown) => {
      const toggleLink = dropdown.querySelector('a');
      if (toggleLink) {
        toggleLink.addEventListener('click', (e) => {
          if (window.innerWidth <= 992) {
            const isOpen = dropdown.classList.contains('open') || dropdown.classList.contains('active');
            if (!isOpen) {
              e.preventDefault();
              dropdown.classList.add('open');
            } else if (e.target.closest('.fa-chevron-down') || e.target.tagName === 'I') {
              e.preventDefault();
              dropdown.classList.remove('open', 'active');
            }
          }
        });
      }
    });
  }

  // 2. Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-item-link, .nav-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (href && !href.includes('#')) {
      link.classList.remove('active');
    }
  });

  // 3. Dynamic Stats Counter Animation with Smooth Easing & Staggered Reveal
  const statNumbers = document.querySelectorAll('.stat-number');
  const statCards = document.querySelectorAll('.stat-card-modern');
  let animated = false;

  // Staggered initial entrance states
  statCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(36px)';
    card.style.transition = `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.14}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.14}s, box-shadow 0.4s ease, border-color 0.4s ease`;
  });

  const animateCounters = () => {
    // Reveal cards in cascade
    statCards.forEach((card) => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });

    // Remove inline transform after entry transition finishes so CSS :hover and 3D tilt work cleanly
    setTimeout(() => {
      statCards.forEach((card) => {
        card.style.transform = '';
      });
    }, 1200);

    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target') || '0', 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      const duration = 2000; // ms
      const startTime = performance.now();

      // Ease-out expo curve for organic deceleration
      const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentCount = Math.round(easeOutExpo(progress) * target);

        stat.textContent = currentCount + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          stat.textContent = target + suffix;
          // Subtle celebration scale pop when counting completes
          stat.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
          stat.style.transform = 'scale(1.08)';
          setTimeout(() => {
            stat.style.transform = 'scale(1)';
          }, 350);
        }
      };

      requestAnimationFrame(step);
    });
  };

  // Interactive 3D Mouse Parallax Tilt for Desktop
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    statCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.12s ease-out, box-shadow 0.4s ease, border-color 0.4s ease';
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = ((y / (rect.height / 2)) * -8).toFixed(2);
        const rotateY = ((x / (rect.width / 2)) * 8).toFixed(2);
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease';
        card.style.transform = '';
      });
    });
  }

  // IntersectionObserver Trigger for Robust Viewport Detection
  const statsBanner = document.querySelector('.stats-banner');
  if (statsBanner) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !animated) {
              animated = true;
              animateCounters();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(statsBanner);
    } else {
      // Fallback for legacy browsers
      window.addEventListener('scroll', () => {
        const bannerPosition = statsBanner.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;

        if (bannerPosition < screenPosition && !animated) {
          animated = true;
          animateCounters();
        }
      });
    }
  }
});
