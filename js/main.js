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

  // 3. Stats Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target') || '0', 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = target / 50;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          stat.textContent = Math.ceil(count) + suffix;
          setTimeout(updateCount, 30);
        } else {
          stat.textContent = target + suffix;
        }
      };

      updateCount();
    });
  };

  // Scroll Trigger for Counters
  const statsBanner = document.querySelector('.stats-banner');
  if (statsBanner) {
    window.addEventListener('scroll', () => {
      const bannerPosition = statsBanner.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;

      if (bannerPosition < screenPosition && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }
});
