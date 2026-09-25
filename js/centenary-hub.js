/**
 * UPGS Punukkonnoor - Centenary Interactive Logo Quick-Hub
 * Features:
 * 1. Floating Circular Logo Medallion with ambient golden glow & hover shimmer
 * 2. Circular SVG Scroll-Progress indicator around the emblem (0% to 100%)
 * 3. Interactive Quick-Access Action Menu (Back to top, Curriculum, Alumni, 360 Tour, WhatsApp, Phone)
 * 4. Responsive & Accessible
 */

(function () {
  if (document.getElementById('centenaryHubWidget')) return;

  // 1. Inject Styles
  const style = document.createElement('style');
  style.id = 'centenary-hub-styles';
  style.textContent = `
    .centenary-hub-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }

    /* Floating Medallion Button */
    .centenary-hub-trigger {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #ffffff;
      border: none;
      padding: 0;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(10, 25, 47, 0.22), 0 0 0 1px rgba(251, 191, 36, 0.4);
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
      animation: hubFloat 3.8s ease-in-out infinite;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }

    .centenary-hub-trigger:hover {
      transform: scale(1.08) translateY(-3px);
      box-shadow: 0 16px 35px rgba(245, 158, 11, 0.35), 0 0 0 2px rgba(245, 158, 11, 0.8);
      animation-play-state: paused;
    }

    .centenary-hub-trigger:active {
      transform: scale(0.96);
    }

    @keyframes hubFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    /* SVG Progress Ring */
    .hub-progress-svg {
      position: absolute;
      top: -4px;
      left: -4px;
      width: 72px;
      height: 72px;
      transform: rotate(-90deg);
      pointer-events: none;
    }

    .hub-progress-bg {
      fill: none;
      stroke: rgba(226, 232, 240, 0.6);
      stroke-width: 3.5;
    }

    .hub-progress-bar {
      fill: none;
      stroke: url(#hubGoldGradient);
      stroke-width: 3.5;
      stroke-linecap: round;
      stroke-dasharray: 188.5;
      stroke-dashoffset: 188.5;
      transition: stroke-dashoffset 0.15s ease-out;
    }

    /* Inner Logo Image & Shimmer */
    .hub-logo-inner {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: #ffffff;
    }

    .hub-logo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }

    .centenary-hub-trigger:hover .hub-logo-img {
      transform: rotate(5deg) scale(1.05);
    }

    /* Shimmer Light Sweep */
    .hub-logo-inner::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -60%;
      width: 40%;
      height: 200%;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.8) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      transform: rotate(30deg);
      pointer-events: none;
      transition: all 0.6s ease;
      opacity: 0;
    }

    .centenary-hub-trigger:hover .hub-logo-inner::after {
      left: 140%;
      opacity: 1;
      transition: all 0.75s ease-in-out;
    }

    /* Small Centenary 100 Crown Badge */
    .hub-centenary-tag {
      position: absolute;
      top: -6px;
      right: -6px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #ffffff;
      font-size: 0.62rem;
      font-weight: 800;
      padding: 0.18rem 0.42rem;
      border-radius: 9999px;
      letter-spacing: 0.04em;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      border: 1.5px solid #ffffff;
      pointer-events: none;
    }

    /* Tooltip */
    .hub-tooltip {
      position: absolute;
      right: calc(100% + 14px);
      top: 50%;
      transform: translateY(-50%) translateX(10px);
      background: #0f172a;
      color: #ffffff;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 700;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 15px rgba(0,0,0,0.25);
      border: 1px solid rgba(251, 191, 36, 0.3);
    }

    .hub-tooltip::after {
      content: '';
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent transparent #0f172a;
    }

    .centenary-hub-trigger:hover .hub-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(0);
    }

    /* Glassmorphism Popup Menu */
    .hub-menu-card {
      position: absolute;
      bottom: calc(100% + 16px);
      right: 0;
      width: 320px;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(226, 232, 240, 0.9);
      box-shadow: 0 25px 60px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(251, 191, 36, 0.35);
      padding: 1.25rem;
      opacity: 0;
      visibility: hidden;
      transform: translateY(14px) scale(0.96);
      transform-origin: bottom right;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .hub-menu-card.active {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .hub-menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 0.85rem;
      margin-bottom: 0.85rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .hub-header-left {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .hub-header-logo {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      object-fit: cover;
    }

    .hub-header-title {
      font-size: 0.95rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
    }

    .hub-header-subtitle {
      font-size: 0.72rem;
      color: #d97706;
      font-weight: 700;
    }

    .hub-close-btn {
      background: #f1f5f9;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }

    .hub-close-btn:hover {
      background: #fee2e2;
      color: #ef4444;
      transform: rotate(90deg);
    }

    /* Menu Action Items */
    .hub-actions-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .hub-action-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.7rem 0.85rem;
      border-radius: 12px;
      text-decoration: none;
      color: #1e293b;
      font-size: 0.88rem;
      font-weight: 700;
      background: #f8fafc;
      border: 1px solid transparent;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .hub-action-item:hover {
      background: #ffffff;
      border-color: #e2e8f0;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      color: #ff4e31;
    }

    .hub-action-icon {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      flex-shrink: 0;
    }

    .hub-action-arrow {
      margin-left: auto;
      font-size: 0.75rem;
      color: #94a3b8;
      transition: transform 0.2s ease;
    }

    .hub-action-item:hover .hub-action-arrow {
      transform: translateX(3px);
      color: #ff4e31;
    }

    .hub-menu-footer {
      margin-top: 0.85rem;
      padding-top: 0.75rem;
      border-top: 1px solid #f1f5f9;
      text-align: center;
      font-size: 0.72rem;
      color: #64748b;
      font-weight: 600;
    }

    @media (max-width: 480px) {
      .centenary-hub-container {
        bottom: 16px;
        right: 16px;
      }
      .hub-menu-card {
        width: 290px;
        right: 0;
      }
      .hub-tooltip {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);

  // 2. Build HTML Structure
  const container = document.createElement('div');
  container.id = 'centenaryHubWidget';
  container.className = 'centenary-hub-container';
  container.innerHTML = `
    <!-- Floating Circular Trigger -->
    <button class="centenary-hub-trigger" id="centenaryHubTrigger" aria-label="Open UPGS Centenary Quick Hub" aria-expanded="false" title="UPGS Centenary Hub">
      <!-- Circular SVG Progress Ring -->
      <svg class="hub-progress-svg" viewBox="0 0 68 68">
        <defs>
          <linearGradient id="hubGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b" />
            <stop offset="100%" stop-color="#ef4444" />
          </linearGradient>
        </defs>
        <circle class="hub-progress-bg" cx="34" cy="34" r="30" />
        <circle class="hub-progress-bar" id="hubProgressBar" cx="34" cy="34" r="30" />
      </svg>

      <!-- Centenary 100 Pill Badge -->
      <span class="hub-centenary-tag">100</span>

      <!-- Emblem Logo Inner -->
      <div class="hub-logo-inner">
        <img src="images/UPGS LOGO.svg" alt="UPGS Punukkonnoor" class="hub-logo-img">
      </div>

      <!-- Hover Tooltip -->
      <span class="hub-tooltip">Centenary Hub • Quick Access</span>
    </button>

    <!-- Glassmorphism Popup Menu -->
    <div class="hub-menu-card" id="hubMenuCard" role="dialog" aria-modal="true" aria-label="Centenary Quick Actions">
      <div class="hub-menu-header">
        <div class="hub-header-left">
          <img src="images/UPGS LOGO.svg" alt="UPGS Logo" class="hub-header-logo">
          <div>
            <div class="hub-header-title">UPGS Punukkonnoor</div>
            <div class="hub-header-subtitle">Centenary Hub (1926 – 2026)</div>
          </div>
        </div>
        <button class="hub-close-btn" id="hubCloseBtn" aria-label="Close menu">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="hub-actions-list">
        <!-- Back to Top Button -->
        <button class="hub-action-item" id="hubBackToTopBtn" type="button" style="text-align: left; width: 100%;">
          <div class="hub-action-icon" style="background: #eef2ff; color: #4f46e5;">
            <i class="fas fa-arrow-up"></i>
          </div>
          <span>Scroll to Top</span>
          <i class="fas fa-chevron-right hub-action-arrow"></i>
        </button>

        <!-- 360 Virtual Tour -->
        <a href="virtual-tour.html" class="hub-action-item">
          <div class="hub-action-icon" style="background: #eff6ff; color: #0284c7;">
            <i class="fas fa-vr-cardboard"></i>
          </div>
          <span>360° Virtual Campus Tour</span>
          <i class="fas fa-chevron-right hub-action-arrow"></i>
        </a>

        <!-- Alumni Portal -->
        <a href="alumni.html" class="hub-action-item">
          <div class="hub-action-icon" style="background: #fdf2f8; color: #db2777;">
            <i class="fas fa-user-graduate"></i>
          </div>
          <span>Centenary Alumni Portal</span>
          <i class="fas fa-chevron-right hub-action-arrow"></i>
        </a>

        <!-- WhatsApp Chat -->
        <a href="https://wa.me/919447135592" target="_blank" rel="noopener noreferrer" class="hub-action-item">
          <div class="hub-action-icon" style="background: #ecfdf5; color: #059669;">
            <i class="fab fa-whatsapp"></i>
          </div>
          <span>Chat on WhatsApp</span>
          <i class="fas fa-chevron-right hub-action-arrow"></i>
        </a>

        <!-- Direct Call Office -->
        <a href="tel:9447135592" class="hub-action-item">
          <div class="hub-action-icon" style="background: #f1f5f9; color: #0f172a;">
            <i class="fas fa-phone-alt"></i>
          </div>
          <span>Call School Office</span>
          <i class="fas fa-chevron-right hub-action-arrow"></i>
        </a>
      </div>

      <div class="hub-menu-footer">
        100 Years of Educational Excellence
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // 3. Elements & State
  const trigger = document.getElementById('centenaryHubTrigger');
  const menu = document.getElementById('hubMenuCard');
  const closeBtn = document.getElementById('hubCloseBtn');
  const backToTopBtn = document.getElementById('hubBackToTopBtn');
  const progressBar = document.getElementById('hubProgressBar');

  const circumference = 2 * Math.PI * 30; // ~188.5
  progressBar.style.strokeDasharray = `${circumference}`;
  progressBar.style.strokeDashoffset = `${circumference}`;

  // 4. Scroll Progress Calculation
  function updateScrollProgress() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
    const offset = circumference - (progress * circumference);
    progressBar.style.strokeDashoffset = offset;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // 5. Open / Close Menu
  function openMenu() {
    menu.classList.add('active');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.classList.remove('active');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu(e) {
    e.stopPropagation();
    if (menu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  trigger.addEventListener('click', toggleMenu);
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenu();
  });

  // Close on Outside Click
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Smooth Scroll to Top
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeMenu();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
})();
