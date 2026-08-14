/* UPGS Punukkannoor - High-Performance Concave Inward 360° Panorama Engine */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.hero-360-bg-container');
  if (!container) return;

  // Clear existing canvas
  container.innerHTML = '<div class="hero-360-overlay"></div>';

  // 1. Create viewport canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'hero-360-vr-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '0';
  canvas.style.objectFit = 'cover';
  container.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = 'images/02.webp';

  let offset = 0;
  const speed = 0.7; // Smooth continuous 360 rotation speed

  function resize() {
    canvas.width = container.clientWidth || window.innerWidth;
    canvas.height = container.clientHeight || 500;
  }
  window.addEventListener('resize', resize);
  resize();

  img.onload = () => {
    function animate() {
      offset = (offset + speed) % img.width;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Concave Inward Curved Panorama Slicing Algorithm
      const numSlices = 80; // 80 vertical slices for silky smooth concave curvature
      const sliceW = Math.ceil(w / numSlices);
      const concaveDepth = 0.22; // Inward concave curve factor

      const scale = Math.max(h / img.height, (w / img.width) * 1.35);
      const scaledW = img.width * scale;
      const scaledH = img.height * scale;

      for (let i = 0; i < numSlices; i++) {
        // Normalized X from -1 (left edge) through 0 (center) to +1 (right edge)
        const normX = (i / (numSlices - 1)) * 2 - 1;
        // Inverted parabolic curve factor for true concave inward depth
        const curveFactor = 1 - (normX * normX);

        // Calculate true concave slice height & vertical offset
        const sliceH = scaledH * (1 - curveFactor * concaveDepth);
        const sliceY = (h - sliceH) / 2;

        // Source slice X on equirectangular image
        const sourceSliceW = img.width / numSlices;
        const sourceX = ((i * sourceSliceW) + offset) % img.width;
        const destX = i * sliceW;

        // Draw inward concave curved slice
        ctx.drawImage(
          img,
          sourceX, 0, sourceSliceW, img.height,
          destX, sliceY, sliceW + 1, sliceH
        );
      }

      requestAnimationFrame(animate);
    }
    animate();
  };

  img.onerror = () => {
    console.log('Image 02.webp concave render notice');
  };
});
