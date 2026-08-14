/* ==========================================================================
   UPGS Punukkannoor — True 3D Inside-Out Globe Panorama Engine
   Renders 2:1 Equirectangular Panoramas from inside a 3D Sphere (Globe)
   Supports: Three.js 3D WebGL Globe, Pitch/Yaw/FOV, Touch & Drag, Auto-Rotate & Pannellum
   ========================================================================== */

const UPGS360Viewer = (function () {
  const scenes = {
    classroom: {
      title: "Digital Smart Classroom",
      panorama: "images/02.webp",
      autoRotate: -0.15
    },
    courtyard: {
      title: "Main Courtyard & Centenary Gate",
      panorama: "images/02.webp",
      autoRotate: -0.2
    },
    library: {
      title: "Central Library & Computer Lab",
      panorama: "images/02.webp",
      autoRotate: -0.18
    }
  };

  let activeTourInstance = null;
  let currentSceneKey = 'classroom';
  const isFileProtocol = window.location.protocol === 'file:';

  /**
   * Builds a mathematically precise 3D Inward Globe Viewer using Three.js
   * @param {HTMLElement} container - DOM Container element
   * @param {string} imageSrc - Path to 2:1 equirectangular image
   * @param {object} options - Custom configuration (autoRotate, fov, etc.)
   */
  function create3DGlobeViewer(container, imageSrc, options = {}) {
    if (!container) return;
    container.innerHTML = '';

    // Read dimensions from the container or its parent to avoid 0-height race condition
    const width  = container.offsetWidth  || container.parentElement?.offsetWidth  || 800;
    const height = container.offsetHeight || container.parentElement?.offsetHeight || 500;

    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
      console.warn('[UPGS 360] Three.js not found, fallback to 2D canvas');
      return fallbackCanvasPan(container, imageSrc);
    }

    // 1. Setup Three.js Scene & Camera inside the Globe Center (0, 0, 0)
    const scene = new THREE.Scene();
    let fov = options.fov || 75;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 1, 1100);

    // Camera spherical parameters (Latitude = Pitch, Longitude = Yaw)
    let lon = options.yaw || 0;
    let lat = options.pitch || 0;
    let phi = 0;
    let theta = 0;

    const autoRotateSpeed = options.autoRotate !== undefined ? options.autoRotate : -0.15;
    let isUserInteracting = false;
    let onPointerDownPointerX = 0;
    let onPointerDownPointerY = 0;
    let onPointerDownLon = 0;
    let onPointerDownLat = 0;

    // 2. Setup WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(width, height);
    // Force explicit pixel dimensions so canvas is never 0×0
    renderer.domElement.style.width  = width  + 'px';
    renderer.domElement.style.height = height + 'px';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.cursor = 'grab';
    container.appendChild(renderer.domElement);

    // 3. Create Inside-Out 3D Sphere (Globe)
    // Scale X by -1 so the equirectangular texture faces INWARD toward camera
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    // Load image safely via DOM Image element to bypass file:// CORS restrictions
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const texture = new THREE.Texture(img);
      texture.needsUpdate = true;
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    };

    img.onerror = () => {
      console.warn(`[UPGS 360 Globe] Image load notice: ${imageSrc}`);
    };

    // 4. Camera View Math Update (Pitch / Yaw to 3D Sphere Point)
    function updateCamera() {
      // Clamp Pitch (latitude) to avoid gimbal lock flip at poles
      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      // Convert spherical coordinates (r, theta, phi) to 3D Cartesian (x, y, z)
      camera.target = new THREE.Vector3(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );

      camera.lookAt(camera.target);
    }

    // 5. Interaction Listeners (Drag Left/Right/Up/Down & Zoom)
    const dom = renderer.domElement;

    function onPointerDown(e) {
      isUserInteracting = true;
      dom.style.cursor = 'grabbing';

      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      onPointerDownPointerX = clientX;
      onPointerDownPointerY = clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    }

    function onPointerMove(e) {
      if (!isUserInteracting) return;

      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      lon = (onPointerDownPointerX - clientX) * 0.15 + onPointerDownLon;
      lat = (clientY - onPointerDownPointerY) * 0.15 + onPointerDownLat;
    }

    function onPointerUp() {
      if (isUserInteracting) {
        isUserInteracting = false;
        dom.style.cursor = 'grab';
      }
    }

    function onWheel(e) {
      e.preventDefault();
      fov += e.deltaY * 0.05;
      fov = Math.max(30, Math.min(100, fov));
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown);
    window.addEventListener('touchmove', onPointerMove);
    window.addEventListener('touchend', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Handle Window Resize
    function onResize() {
      const w = container.offsetWidth  || container.parentElement?.offsetWidth  || 800;
      const h = container.offsetHeight || container.parentElement?.offsetHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.domElement.style.width  = w + 'px';
      renderer.domElement.style.height = h + 'px';
    }
    window.addEventListener('resize', onResize);

    // 6. Animation Loop
    let animId = null;
    function animate() {
      animId = requestAnimationFrame(animate);

      if (!isUserInteracting) {
        lon += autoRotateSpeed;
      }

      updateCamera();
      renderer.render(scene, camera);
    }
    animate();

    return {
      destroy: () => {
        if (animId) cancelAnimationFrame(animId);
        renderer.dispose();
      }
    };
  }

  /**
   * Initializes Pannellum or 3D Globe Viewer for single container
   */
  function initSingleViewer(containerId, customConfig = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    const imageSrc = customConfig.panorama || 'images/02.webp';

    // When running on file:// or if user prefers native 3D Globe, use Three.js Globe Viewer
    if (isFileProtocol || typeof THREE !== 'undefined') {
      return create3DGlobeViewer(container, imageSrc, customConfig);
    }

    if (window.pannellum) {
      try {
        const v = window.pannellum.viewer(containerId, customConfig);
        v.on('error', () => create3DGlobeViewer(container, imageSrc, customConfig));
        return v;
      } catch (err) {
        return create3DGlobeViewer(container, imageSrc, customConfig);
      }
    }

    return create3DGlobeViewer(container, imageSrc, customConfig);
  }

  /**
   * Initializes Multi-Scene Virtual Tour
   */
  function initMultiSceneTour(containerId = 'panorama-viewer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (isFileProtocol || typeof THREE !== 'undefined') {
      create3DGlobeViewer(container, scenes.classroom.panorama, { autoRotate: -0.15 });
      setupSceneSelectorButtons();
      return;
    }

    if (window.pannellum) {
      try {
        activeTourInstance = window.pannellum.viewer(containerId, {
          default: {
            firstScene: 'classroom',
            author: 'UPGS Punukkannoor',
            sceneFadeDuration: 1000,
            autoLoad: true,
            compass: false,
            showZoomCtrl: true,
            showFullscreenCtrl: true
          },
          scenes: scenes
        });
        activeTourInstance.on('scenechange', (sceneId) => updateSceneButtons(sceneId));
        activeTourInstance.on('error', () => create3DGlobeViewer(container, scenes.classroom.panorama));
        setupSceneSelectorButtons();
        return;
      } catch (e) {
        // Fallback below
      }
    }

    create3DGlobeViewer(container, scenes.classroom.panorama, { autoRotate: -0.15 });
    setupSceneSelectorButtons();
  }

  function loadScene(sceneKey) {
    currentSceneKey = sceneKey;
    updateSceneButtons(sceneKey);

    const container = document.getElementById('panorama-viewer');
    if (scenes[sceneKey] && container) {
      create3DGlobeViewer(container, scenes[sceneKey].panorama, { autoRotate: scenes[sceneKey].autoRotate });
    }
  }

  function setupSceneSelectorButtons() {
    const buttons = document.querySelectorAll('.scene-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetScene = btn.getAttribute('data-scene');
        if (targetScene && scenes[targetScene]) {
          loadScene(targetScene);
        }
      });
    });
  }

  function updateSceneButtons(activeSceneKey) {
    const buttons = document.querySelectorAll('.scene-btn');
    buttons.forEach((btn) => {
      if (btn.getAttribute('data-scene') === activeSceneKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function fallbackCanvasPan(container, imageSrc) {
    if (!container) return;
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      let offset = 0;
      function animate() {
        offset = (offset + 0.5) % img.width;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, -offset, 0, canvas.width * 2, canvas.height);
        requestAnimationFrame(animate);
      }
      animate();
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Delay init slightly so browser fully computes layout dimensions first
    setTimeout(() => {
      if (document.getElementById('panorama-viewer')) {
        initMultiSceneTour('panorama-viewer');
      }
      if (document.getElementById('hero-360-viewer')) {
        initSingleViewer('hero-360-viewer', { autoRotate: -0.15 });
      }
      if (document.getElementById('index-360-viewer')) {
        initSingleViewer('index-360-viewer', { autoRotate: -0.2, fov: 75 });
      }
    }, 100);
  });

  return {
    init: initSingleViewer,
    initTour: initMultiSceneTour,
    loadScene: loadScene
  };
})();
