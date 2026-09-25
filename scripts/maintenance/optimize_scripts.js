const fs = require('fs');

// 1. Optimize virtual-tour.html
let vt = fs.readFileSync('virtual-tour.html', 'utf8');

// Remove three.js and pannellum from head
vt = vt.replace(/<script\s+type=["']module["']\s+src=["']https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js["']><\/script>\s*/i, '');
vt = vt.replace(/<script\s+type=["']module["']\s+src=["']https:\/\/cdn\.jsdelivr\.net\/npm\/pannellum@2\.5\.6\/build\/pannellum\.js["']><\/script>\s*/i, '');

// Place them before closing body tag with defer, plus centenary-hub.js
const vtBottom = `  <!-- 3D & 360 Tour Scripts (Deferred to eliminate render blocking) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js" defer></script>
  <script type="module" src="js/main.js"></script>
  <script type="module" src="js/360-viewer.js"></script>
  <script type="module" src="js/centenary-hub.js"></script>
</body>`;

vt = vt.replace(/<script\s+type=["']module["']\s+src=["']js\/main\.js["']><\/script>\s*<script\s+type=["']module["']\s+src=["']js\/360-viewer\.js["']><\/script>\s*<\/body>/i, vtBottom);
fs.writeFileSync('virtual-tour.html', vt, 'utf8');
console.log('virtual-tour.html optimized successfully.');
