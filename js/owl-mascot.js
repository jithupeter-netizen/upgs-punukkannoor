/**
 * Wise Scholar Owl Mascot - Site-Wide Interactive Companion
 * UPGS Punukkannoor 100th Centenary Jubilee (1926 - 2026)
 * 
 * Features:
 * 1. Passive scroll-driven flight: Owl spreads wide wings and flaps while scrolling,
 *    then lands gracefully on its centenary books when scrolling pauses.
 * 2. 60 FPS vector eye-tracking: Pupils dynamically follow the mouse cursor.
 * 3. Speech bubble: Click the owl to hear centenary facts and school tips.
 * 4. Lightweight & zero-dependency: Pure SVG + GPU-accelerated CSS transforms.
 */

(function () {
  'use strict';

  // Prevent multiple initializations
  if (document.getElementById('owlCompanionContainer')) return;

  const facts = [
    "Hoot! 100 Years of Learning! 🎓",
    "Founded in 1926 by Sri. Padmanabha Pillai! 🏛️",
    "Scroll to watch me fly along with you! 🕊️",
    "Explore our 360° Virtual Campus Tour! 🌟",
    "Calling all alumni: Join our Centenary directory! 🤝",
    "Knowledge is our greatest treasure! 📚"
  ];
  let factIndex = 0;
  let scrollTimeout = null;
  let bubbleTimeout = null;

  // Create Container
  const container = document.createElement('div');
  container.id = 'owlCompanionContainer';
  container.className = 'owl-companion-widget';
  container.setAttribute('aria-label', 'UPGS Owl Mascot Companion');

  // Check saved minimize state
  if (sessionStorage.getItem('upgs_owl_minimized') === 'true') {
    container.classList.add('minimized');
  }

  container.innerHTML = `
    <!-- Speech Bubble -->
    <div class="owl-companion-bubble" id="owlMascotBubble">Hoot! Scroll to fly with me! 🎓</div>

    <!-- Minimize Button -->
    <button class="owl-minimize-btn" id="owlMinimizeBtn" title="Minimize mascot" aria-label="Minimize mascot">
      <i class="fas fa-times"></i>
    </button>

    <!-- Restore Button (Visible when minimized) -->
    <button class="owl-restore-btn" id="owlRestoreBtn" title="Restore UPGS Owl Mascot" aria-label="Restore UPGS Owl Mascot">
      <i class="fas fa-graduation-cap"></i>
    </button>

    <!-- Perch Platform (100 Years Book & Branch) -->
    <div class="owl-perch-platform">
      <svg width="96" height="24" viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="16" width="130" height="20" rx="3" fill="#7f1d1d" stroke="#f59e0b" stroke-width="1.5"/>
        <line x1="22" y1="18" x2="22" y2="34" stroke="#fbbf24" stroke-width="2"/>
        <text x="80" y="29" fill="#fde68a" font-family="'Outfit', sans-serif" font-size="9" font-weight="900" text-anchor="middle">UPGS • 100 YEARS</text>
        <path d="M 5 12 C 40 6, 120 6, 155 12 C 158 13, 158 19, 155 20 C 120 15, 40 15, 5 20 Z" fill="#854d0e"/>
        <ellipse cx="10" cy="8" rx="5" ry="3" fill="#22c55e" transform="rotate(-30 10 8)"/>
      </svg>
    </div>

    <!-- Owl Character Actor -->
    <div class="owl-body-wrapper" id="owlBodyWrapper" title="Click me for a centenary fact!">
      <svg width="100%" height="100%" viewBox="-45 -25 350 280" fill="none" style="overflow: visible;" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bodyBlueComp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e3a8a"/>
            <stop offset="60%" stop-color="#0f244a"/>
            <stop offset="100%" stop-color="#0a192f"/>
          </linearGradient>
          <linearGradient id="bellyCreamComp" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fffbeb"/>
            <stop offset="60%" stop-color="#fef3c7"/>
            <stop offset="100%" stop-color="#fde68a"/>
          </linearGradient>
          <linearGradient id="goldFeatherComp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="50%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
          <linearGradient id="wingNavyComp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e3a8a"/>
            <stop offset="100%" stop-color="#0c1d3c"/>
          </linearGradient>
        </defs>

        <!-- WIDE SPREAD WING - LEFT (FLIGHT MODE) -->
        <g id="owlSpreadLeft" class="owl-wing-spread">
          <path d="M 85 125 C 60 110, 15 90, 5 70 C -2 60, 2 52, 12 55 C 25 58, 45 75, 55 70 C 65 65, 30 45, 20 38 C 15 32, 22 25, 32 28 C 48 35, 70 65, 80 62 C 72 45, 55 25, 50 18 C 45 12, 54 6, 62 10 C 78 20, 95 65, 100 85 C 105 105, 95 120, 85 125 Z" 
                fill="url(#wingNavyComp)" stroke="#3b82f6" stroke-width="2"/>
          <path d="M 12 55 C 22 58, 38 72, 48 70" stroke="url(#goldFeatherComp)" stroke-width="4" stroke-linecap="round"/>
          <path d="M 32 28 C 44 35, 62 60, 70 58" stroke="url(#goldFeatherComp)" stroke-width="4" stroke-linecap="round"/>
          <path d="M 62 10 C 72 20, 88 55, 92 68" stroke="url(#goldFeatherComp)" stroke-width="4" stroke-linecap="round"/>
        </g>

        <!-- WIDE SPREAD WING - RIGHT (FLIGHT MODE) -->
        <g id="owlSpreadRight" class="owl-wing-spread">
          <path d="M 175 125 C 200 110, 245 90, 255 70 C 262 60, 258 52, 248 55 C 235 58, 215 75, 205 70 C 195 65, 230 45, 240 38 C 245 32, 238 25, 228 28 C 212 35, 190 65, 180 62 C 188 45, 205 25, 210 18 C 215 12, 206 6, 198 10 C 182 20, 165 65, 160 85 C 155 105, 165 120, 175 125 Z" 
                fill="url(#wingNavyComp)" stroke="#3b82f6" stroke-width="2"/>
          <path d="M 248 55 C 238 58, 222 72, 212 70" stroke="url(#goldFeatherComp)" stroke-width="4" stroke-linecap="round"/>
          <path d="M 228 28 C 216 35, 198 60, 190 58" stroke="url(#goldFeatherComp)" stroke-width="4" stroke-linecap="round"/>
          <path d="M 198 10 C 188 20, 172 55, 168 68" stroke="url(#goldFeatherComp)" stroke-width="4" stroke-linecap="round"/>
        </g>

        <!-- Tail Feathers -->
        <path d="M 115 180 L 130 215 L 145 180 Z" fill="#091427"/>
        <path d="M 122 180 L 130 210 L 138 180 Z" fill="#f59e0b" opacity="0.6"/>

        <!-- FOLDED WINGS (RESTING) -->
        <g class="owl-wing-resting">
          <path d="M 85 110 C 60 125, 52 165, 80 185 C 92 170, 96 140, 85 110 Z" fill="#132752" stroke="#2563eb" stroke-width="1.5"/>
          <path d="M 62 135 C 56 155, 65 175, 78 182" stroke="url(#goldFeatherComp)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M 72 125 C 68 148, 76 168, 86 172" stroke="url(#goldFeatherComp)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </g>
        <g class="owl-wing-resting">
          <path d="M 175 110 C 200 125, 208 165, 180 185 C 168 170, 164 140, 175 110 Z" fill="#132752" stroke="#2563eb" stroke-width="1.5"/>
          <path d="M 198 135 C 204 155, 195 175, 182 182" stroke="url(#goldFeatherComp)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M 188 125 C 192 148, 184 168, 174 172" stroke="url(#goldFeatherComp)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </g>

        <!-- Torso -->
        <ellipse cx="130" cy="138" rx="52" ry="62" fill="url(#bodyBlueComp)"/>

        <!-- Belly with golden feather scallops -->
        <ellipse cx="130" cy="150" rx="36" ry="42" fill="url(#bellyCreamComp)"/>
        <path d="M 118 138 Q 124 144 130 138 Q 136 144 142 138" stroke="#d97706" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M 112 153 Q 121 160 130 153 Q 139 160 148 153" stroke="#d97706" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M 118 168 Q 124 174 130 168 Q 136 174 142 168" stroke="#d97706" stroke-width="2.5" fill="none" stroke-linecap="round"/>

        <!-- Ears with Gold Highlights -->
        <path d="M 92 75 L 75 42 L 105 60 Z" fill="#091427"/>
        <path d="M 168 75 L 185 42 L 155 60 Z" fill="#091427"/>
        <path d="M 94 70 L 82 48 L 102 61 Z" fill="url(#goldFeatherComp)"/>
        <path d="M 166 70 L 178 48 L 158 61 Z" fill="url(#goldFeatherComp)"/>

        <!-- Large Eye Sockets -->
        <circle cx="106" cy="98" r="26" fill="#ffffff" stroke="#f59e0b" stroke-width="4.5"/>
        <circle cx="154" cy="98" r="26" fill="#ffffff" stroke="#f59e0b" stroke-width="4.5"/>

        <!-- Dynamic Left Pupil (Center 106, 98) -->
        <g id="owlPupilLeftComp" transform="translate(106, 98)">
          <circle cx="0" cy="0" r="12" fill="#0a192f"/>
          <circle cx="-3.5" cy="-4" r="4.2" fill="#ffffff"/>
          <circle cx="4" cy="3.5" r="1.8" fill="#ffffff"/>
        </g>

        <!-- Dynamic Right Pupil (Center 154, 98) -->
        <g id="owlPupilRightComp" transform="translate(154, 98)">
          <circle cx="0" cy="0" r="12" fill="#0a192f"/>
          <circle cx="-3.5" cy="-4" r="4.2" fill="#ffffff"/>
          <circle cx="4" cy="3.5" r="1.8" fill="#ffffff"/>
        </g>

        <!-- Golden Beak -->
        <polygon points="130,105 121,122 139,122" fill="url(#goldFeatherComp)" transform="rotate(180 130 117)"/>

        <!-- Academic Graduation Cap -->
        <polygon points="130,22 188,40 130,56 72,40" fill="#061225" stroke="#f59e0b" stroke-width="2"/>
        <rect x="105" y="48" width="50" height="12" rx="3" fill="#030914"/>
        <circle cx="130" cy="39" r="3.5" fill="#f59e0b"/>
        <path d="M 130 39 Q 165 44 178 65" stroke="#fbbf24" stroke-width="2.5" fill="none"/>
        <rect x="174" y="65" width="8" height="14" rx="2" fill="#f59e0b"/>

        <!-- Claws -->
        <ellipse cx="114" cy="198" rx="8" ry="5" fill="#f59e0b"/>
        <ellipse cx="123" cy="198" rx="7" ry="5" fill="#f59e0b"/>
        <ellipse cx="137" cy="198" rx="7" ry="5" fill="#f59e0b"/>
        <ellipse cx="146" cy="198" rx="8" ry="5" fill="#f59e0b"/>
      </svg>
    </div>
  `;

  document.body.appendChild(container);

  // References
  const bubble = document.getElementById('owlMascotBubble');
  const owlBody = document.getElementById('owlBodyWrapper');
  const minimizeBtn = document.getElementById('owlMinimizeBtn');
  const restoreBtn = document.getElementById('owlRestoreBtn');
  const pupilLeft = document.getElementById('owlPupilLeftComp');
  const pupilRight = document.getElementById('owlPupilRightComp');

  // Initial welcome bubble on page load
  setTimeout(() => {
    if (!container.classList.contains('minimized')) {
      showSpeechBubble("Hoot! Welcome to UPGS! 🎓", 3500);
    }
  }, 1800);

  // 1. Passive Scroll Listener: Triggers Flight & Wing Flapping
  window.addEventListener('scroll', () => {
    if (container.classList.contains('minimized')) return;

    if (!container.classList.contains('flying')) {
      container.classList.add('flying');
    }

    // Debounce landing when scrolling stops
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      container.classList.remove('flying');
    }, 450);
  }, { passive: true });

  // 2. Hardware-accelerated Eye Tracking
  const maxTravel = 8.5;
  let mouseX = 0, mouseY = 0;
  let ticking = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        updatePupils(mouseX, mouseY);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  function updatePupils(x, y) {
    if (!pupilLeft || !pupilRight || container.classList.contains('minimized')) return;

    // Left eye calculation
    const leftRect = pupilLeft.getBoundingClientRect();
    const lx = leftRect.left + leftRect.width / 2;
    const ly = leftRect.top + leftRect.height / 2;
    const dxL = x - lx;
    const dyL = y - ly;
    const angleL = Math.atan2(dyL, dxL);
    const distL = Math.min(maxTravel, Math.hypot(dxL, dyL) / 22);
    pupilLeft.setAttribute('transform', `translate(${106 + Math.cos(angleL) * distL}, ${98 + Math.sin(angleL) * distL})`);

    // Right eye calculation
    const rightRect = pupilRight.getBoundingClientRect();
    const rx = rightRect.left + rightRect.width / 2;
    const ry = rightRect.top + rightRect.height / 2;
    const dxR = x - rx;
    const dyR = y - ry;
    const angleR = Math.atan2(dyR, dxR);
    const distR = Math.min(maxTravel, Math.hypot(dxR, dyR) / 22);
    pupilRight.setAttribute('transform', `translate(${154 + Math.cos(angleR) * distR}, ${98 + Math.sin(angleR) * distR})`);
  }

  // 3. Speech Bubble interaction on Click
  owlBody.addEventListener('click', (e) => {
    e.stopPropagation();
    factIndex = (factIndex + 1) % facts.length;
    showSpeechBubble(facts[factIndex], 3500);

    // Cute hop animation
    owlBody.style.transform = 'translateX(-50%) translateY(-12px) scale(1.06)';
    setTimeout(() => {
      owlBody.style.transform = '';
    }, 280);
  });

  function showSpeechBubble(text, duration = 3000) {
    bubble.textContent = text;
    bubble.classList.add('visible');
    clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
      bubble.classList.remove('visible');
    }, duration);
  }

  // 4. Minimize / Restore handling
  minimizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    container.classList.add('minimized');
    sessionStorage.setItem('upgs_owl_minimized', 'true');
  });

  restoreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    container.classList.remove('minimized');
    sessionStorage.setItem('upgs_owl_minimized', 'false');
    showSpeechBubble("Hoot! I'm back! 🎓", 2500);
  });

})();
