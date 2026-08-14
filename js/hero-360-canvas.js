/* UPGS Punukkannoor - High-Performance Seamless 360° Canvas Pan Engine */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.hero-360-bg-container');
  if (!container) return;

  // Create native HTML5 Canvas
  let canvas = document.getElementById('hero-360-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'hero-360-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    container.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = 'images/02.webp';

  let offsetX = 0;
  const speed = 0.6; // Speed of 360 continuous rotation
  let animationFrameId = null;

  function resize() {
    if (!container) return;
    canvas.width = container.clientWidth || window.innerWidth;
    canvas.height = container.clientHeight || 500;
  }

  window.addEventListener('resize', resize);
  resize();

  img.onload = () => {
    function render() {
      offsetX = (offsetX + speed) % img.width;

      // Calculate scale to cover canvas vertically & horizontally
      const scale = Math.max(canvas.height / img.height, (canvas.width / img.width) * 1.25);
      const scaledW = img.width * scale;
      const scaledH = img.height * scale;
      const drawY = (canvas.height - scaledH) / 2;

      // Calculate seamless looping X position
      const drawX = -(offsetX * scale) % scaledW;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw primary 360 scene
      ctx.drawImage(img, drawX, drawY, scaledW, scaledH);
      // Draw seamless adjacent 360 scene for 360 loop
      ctx.drawImage(img, drawX + scaledW - 1, drawY, scaledW, scaledH);

      animationFrameId = requestAnimationFrame(render);
    }

    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    render();
  };
});
