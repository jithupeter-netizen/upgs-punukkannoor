/* UPGS Punukkannoor - Bulletproof 3D Spherical WebGL 360 Panorama Engine */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.hero-360-bg-container');
  if (!container) return;

  if (typeof THREE === 'undefined') {
    console.warn('Three.js library not loaded yet');
    return;
  }

  // 1. Create WebGL Scene & Perspective Camera inside the 3D Sphere
  const scene = new THREE.Scene();
  const w = container.clientWidth || window.innerWidth;
  const h = container.clientHeight || 500;
  const camera = new THREE.PerspectiveCamera(75, w / h, 1, 1100);
  camera.position.set(0, 0, 0);

  // 2. Create WebGL Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  const dom = renderer.domElement;
  dom.id = 'hero-360-three-canvas';
  dom.style.position = 'absolute';
  dom.style.top = '0';
  dom.style.left = '0';
  dom.style.width = '100%';
  dom.style.height = '100%';
  dom.style.zIndex = '1';
  
  container.appendChild(dom);

  // 3. Create 3D Sphere Geometry for 360 Panorama Projection
  const geometry = new THREE.SphereGeometry(500, 60, 40);

  let sphereMesh = null;

  // 4. Native HTML Image DOM loader (Bypasses local file CORS restrictions)
  const img = new Image();

  img.onload = () => {
    const texture = new THREE.Texture(img);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // CRITICAL: DoubleSide ensures texture renders on the INSIDE of the 3D sphere!
    const material = new THREE.MeshBasicMaterial({ 
      map: texture, 
      side: THREE.DoubleSide 
    });
    
    sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);

    // 60 FPS 3D Spherical Auto-Rotation Loop
    function animate() {
      requestAnimationFrame(animate);
      if (sphereMesh) {
        sphereMesh.rotation.y += 0.0015; // Continuous 360 3D spherical rotation
      }
      renderer.render(scene, camera);
    }
    animate();
  };

  img.onerror = (e) => {
    console.log('360 Image load notice for images/02.webp:', e);
  };

  img.src = 'images/02.webp';

  // Responsive Resize Handler
  window.addEventListener('resize', () => {
    if (!container) return;
    const rw = container.clientWidth || window.innerWidth;
    const rh = container.clientHeight || 500;
    camera.aspect = rw / rh;
    camera.updateProjectionMatrix();
    renderer.setSize(rw, rh);
  });
});
