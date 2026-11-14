/* ==========================================================================
   UPGS Punukkonnoor — Headless CMS Client Loader
   Connects to Google Sheets & Google Drive Backend
   Features:
   - Dynamic Google Drive Hero Slider (Streamed directly from Drive "Slide" folder)
   - Dynamic Google Drive Photo Gallery (Streamed directly from Drive "Gallery" subfolders)
   - Real-time Category Filtering from Drive Subfolders (Slide photos strictly excluded)
   - Announcements Ticker
   - Dynamic Leadership Messages
   - Testimonials Showcase
   - YouTube Video Player Showcase with Modal
   - Instant LocalStorage Caching & Background Revalidation
   ========================================================================== */

const GOOGLE_CMS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzZ7sw_OCbXA5_NS6JhmDoh2IZs0Br8EHVHoKnoveu0tVMaN-vmTclej--00Q2Jd7G16A/exec';
const CACHE_KEY = 'upgs_cms_cache_v2';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Checks if a photo belongs to the Slide / Hero banner category
 */
function isSlideCategory(category) {
  if (!category) return false;
  return /^(slide|slides|hero|banner|banners)$/i.test(String(category).trim());
}

/**
 * Initializes CMS Content on DOM Ready
 */
document.addEventListener('DOMContentLoaded', () => {
  initCMS();
});

async function initCMS() {
  const isGalleryPage = !!document.getElementById('galleryGrid') || window.location.pathname.includes('gallery');
  const isHomePage = !!document.querySelector('.fullwidth-slides-container') || window.location.pathname === '/' || window.location.pathname.endsWith('index.html');

  // 1. Render INSTANTLY from localStorage cache (0ms delay)
  const cachedData = getLocalCache();
  if (cachedData) {
    applyCMSData(cachedData);
  }

  // 2. Fetch live data in background (Stale-While-Revalidate pattern)
  try {
    const hasEmptyGallery = isGalleryPage && (!cachedData || !cachedData.gallery || cachedData.gallery.length === 0);
    const hasEmptySlides = isHomePage && (!cachedData || !cachedData.slides || cachedData.slides.length === 0);
    const isStale = !cachedData || hasEmptyGallery || hasEmptySlides || (Date.now() - cachedData._cachedAt > CACHE_TTL_MS);

    if (isStale) {
      const freshData = await fetchFromGoogle(false);
      if (freshData && freshData.status === 'success' && freshData.data) {
        setLocalCache(freshData.data);
        applyCMSData(freshData.data);
      } else if (isGalleryPage && hasEmptyGallery) {
        handleEmptyGallery();
      }
    }
  } catch (err) {
    console.warn('[UPGS CMS] Sync notice:', err);
    if (isGalleryPage && (!cachedData || !cachedData.gallery || cachedData.gallery.length === 0)) {
      handleEmptyGallery();
    }
  }
}

/**
 * Fetches JSON payload from Google Apps Script Web App
 */
async function fetchFromGoogle(bypassCache = false) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const url = `${GOOGLE_CMS_ENDPOINT}?type=all${bypassCache ? '&nocache=1' : ''}`;
  const res = await fetch(url, {
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  return await res.json();
}

/**
 * Handles empty gallery or waiting state
 */
function handleEmptyGallery() {
  const grid = document.getElementById('galleryGrid');
  const filterContainer = document.getElementById('galleryFilterButtons');
  if (filterContainer) filterContainer.innerHTML = '';

  if (grid) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: #ffffff; border-radius: 16px; border: 1.5px dashed #cbd5e1; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <i class="fab fa-google-drive" style="font-size: 3rem; color: #4285F4; margin-bottom: 1.25rem; display: inline-block;"></i>
        <h3 style="color: var(--primary-navy, #0a192f); font-size: 1.35rem; margin-bottom: 0.5rem; font-weight: 700;">Google Drive Gallery Connected</h3>
        <p style="color: #64748b; font-size: 1rem; max-width: 580px; margin: 0 auto 1.5rem auto; line-height: 1.6;">
          Photos added to your shared Google Drive folder will automatically appear here.
        </p>
        <a href="https://drive.google.com/drive/folders/1KPmJMR-dLNFNv80TxEWNg7t3ASeyCWL9?usp=drive_link" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.75rem; border-radius: 9999px; text-decoration: none; font-weight: 600;">
          <i class="fas fa-folder-open"></i> Open Google Drive Folder
        </a>
      </div>
    `;
  }
}

/**
 * Applies fetched CMS data across the webpage
 */
function applyCMSData(data) {
  if (!data) return;

  if (data.settings) {
    renderAnnouncements(data.settings);
    renderLeadership(data.settings);
  }

  if (data.videos) {
    renderVideos(data.videos);
  }

  if (data.testimonials) {
    renderTestimonials(data.testimonials);
  }

  // 1. Google Drive Photo Gallery (Exclusive to gallery page)
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid || window.location.pathname.includes('gallery')) {
    const allGallery = data.gallery || [];
    // Strict separation: Filter OUT any photo belonging to the Slide category
    const galleryPhotos = allGallery.filter(p => !isSlideCategory(p.category));

    if (galleryPhotos.length > 0) {
      renderDriveGallery(galleryPhotos);
    } else {
      handleEmptyGallery();
    }
  }

  // 2. Google Drive Homepage Hero Slider (Exclusive to index / pages with hero slider)
  const slideContainer = document.querySelector('.fullwidth-slides-container');
  if (slideContainer) {
    // Slides come either from explicit data.slides OR filtered from data.gallery
    const slidePhotos = (data.slides && data.slides.length > 0)
      ? data.slides
      : (data.gallery || []).filter(p => isSlideCategory(p.category));

    if (slidePhotos && slidePhotos.length > 0) {
      // Natural sort by title/filename if numbered (e.g., 01_banner.webp, 02_banner.webp)
      slidePhotos.sort((a, b) => (a.title || '').localeCompare(b.title || '', undefined, { numeric: true, sensitivity: 'base' }));
      renderHeroSlider(slidePhotos);
    }
  }
}

/* ==========================================================================
   1. Announcements Bar Renderer
   ========================================================================== */
function renderAnnouncements(settings) {
  const bar = document.getElementById('liveAnnouncementBar');
  const textElem = document.getElementById('liveAnnouncementText');
  const badgeElem = document.getElementById('liveAnnouncementBadge');

  const announcementText = settings.announcement_message || settings.hero_announcement;
  const badgeText = settings.announcement_badge;

  if (bar && textElem) {
    if (announcementText && announcementText.trim().length > 0) {
      textElem.textContent = announcementText;
      if (badgeElem && badgeText) badgeElem.textContent = badgeText;
      bar.style.display = 'flex';
    } else if (settings.announcement_message === '') {
      bar.style.display = 'none';
    }
  }
}

/* ==========================================================================
   2. Leadership Messages Renderer
   ========================================================================== */
function renderLeadership(settings) {
  const hmName = document.getElementById('hm-name-text');
  const hmTitle = document.getElementById('hm-title-text');
  const hmMsg = document.getElementById('hm-message-text');
  const hmPhoto = document.getElementById('hm-photo-img');

  if (settings.hm_name && hmName) hmName.textContent = settings.hm_name;
  if (settings.hm_title && hmTitle) hmTitle.innerHTML = `<span style="color: #b45309; font-weight: 700;">★ ${escapeHtml(settings.hm_title)}</span>, UPGS Punukkonnoor`;
  if (settings.hm_message && hmMsg) hmMsg.textContent = settings.hm_message;
  if (settings.hm_photo && hmPhoto) hmPhoto.src = settings.hm_photo;

  const dirName = document.getElementById('dir-name-text');
  const dirTitle = document.getElementById('dir-title-text');
  const dirMsg = document.getElementById('dir-message-text');
  const dirPhoto = document.getElementById('dir-photo-img');

  if (settings.director_name && dirName) dirName.textContent = settings.director_name;
  if (settings.director_title && dirTitle) dirTitle.textContent = settings.director_title;
  if (settings.director_message && dirMsg) dirMsg.textContent = settings.director_message;
  if (settings.director_photo && dirPhoto) dirPhoto.src = settings.director_photo;
}

/* ==========================================================================
   3. YouTube Video Showcase Renderer
   ========================================================================== */
function renderVideos(videos) {
  const container = document.getElementById('videos-grid');
  if (!container || !videos || videos.length === 0) return;

  container.innerHTML = videos.map((video) => {
    const thumb = video.thumbnail || (video.videoId ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg` : '');
    const vId = video.videoId || '';

    return `
      <div class="video-card" onclick="openVideoModal('${vId}', '${escapeHtml(video.title)}')">
        <div class="video-thumb-wrap">
          <img src="${thumb}" alt="${escapeHtml(video.title)}" class="video-thumb-img" loading="lazy">
          <div class="video-play-btn">
            <i class="fas fa-play"></i>
          </div>
          <span class="video-category-tag">${escapeHtml(video.category || 'School Life')}</span>
        </div>
        <div class="video-card-body">
          <h3 class="video-card-title">${escapeHtml(video.title)}</h3>
          <div class="video-card-footer">
            <span class="video-play-hint"><i class="fab fa-youtube" style="color: #ef4444; margin-right: 5px;"></i> Watch Video</span>
            <i class="fas fa-arrow-right video-arrow"></i>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   4. Testimonials Showcase Renderer
   ========================================================================== */
function renderTestimonials(testimonials) {
  const container = document.getElementById('testimonials-grid');
  if (!container || !testimonials || testimonials.length === 0) return;

  container.innerHTML = testimonials.map((item) => `
    <div class="testimonial-card">
      <div class="testimonial-stars">
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
      </div>
      <p class="testimonial-quote">“${escapeHtml(item.message)}”</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">
          <i class="fas fa-user-graduate"></i>
        </div>
        <div>
          <h4 class="testimonial-name">${escapeHtml(item.name)}</h4>
          <span class="testimonial-role">${escapeHtml(item.role)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   5. Google Drive Homepage Hero Slider Renderer
   ========================================================================== */
function renderHeroSlider(slidePhotos) {
  const slidesContainer = document.querySelector('.fullwidth-slides-container');
  const dotsContainer = document.querySelector('.hero-dots');

  if (!slidesContainer || !slidePhotos || slidePhotos.length === 0) return;

  // Prevent re-rendering if the exact same slides are already loaded (zero flicker)
  const currentIds = Array.from(slidesContainer.querySelectorAll('.hero-slide')).map(s => s.dataset.id).filter(Boolean);
  const newIds = slidePhotos.map(p => String(p.id || p.src || ''));
  if (currentIds.length > 0 && currentIds.length === newIds.length && currentIds.every((id, i) => id === newIds[i])) {
    return;
  }

  // 1. Generate Slide Items
  const slidesHtml = slidePhotos.map((photo, index) => {
    const fullUrl = photo.fullUrl || (photo.id ? `https://lh3.googleusercontent.com/d/${photo.id}=s1600` : photo.src);
    const fallbackUrl = photo.id ? `https://drive.google.com/thumbnail?id=${photo.id}&sz=w1600` : photo.src;
    const title = photo.title || `UPGS Punukkonnoor Campus Banner ${index + 1}`;
    const priorityAttr = index === 0 ? 'fetchpriority="high"' : 'loading="lazy"';
    const activeClass = index === 0 ? 'active' : '';

    return `
      <div class="hero-slide fullwidth-slide ${activeClass}" id="slide-${index + 1}" data-id="${photo.id || index}">
        <img ${priorityAttr} 
             src="${fullUrl}" 
             alt="${escapeHtml(title)}" 
             class="fullwidth-slide-img"
             referrerpolicy="no-referrer"
             onerror="if(!this.dataset.tried){this.dataset.tried=1;this.src='${fallbackUrl}';}">
      </div>
    `;
  }).join('');

  // 2. Generate Corresponding Progress Dots
  let dotsHtml = '';
  if (dotsContainer) {
    dotsHtml = slidePhotos.map((_, index) => {
      const activeClass = index === 0 ? 'active' : '';
      return `
        <div class="hero-dot ${activeClass}" data-slide="${index}" aria-label="Slide ${index + 1}">
          <div class="dot-progress"></div>
        </div>
      `;
    }).join('');
  }

  slidesContainer.innerHTML = slidesHtml;
  if (dotsContainer) {
    dotsContainer.innerHTML = dotsHtml;
  }

  // 3. Re-initialize and start slider engine
  if (typeof window.initHeroSlider === 'function') {
    window.initHeroSlider();
  }
}

/* ==========================================================================
   6. Google Drive Photo Gallery Renderer
   Direct CDN Streaming: https://lh3.googleusercontent.com/d/FILE_ID
   ========================================================================== */
function renderDriveGallery(photos) {
  const grid = document.getElementById('galleryGrid');
  if (!grid || !photos || photos.length === 0) {
    handleEmptyGallery();
    return;
  }

  // Strictly filter out any photo with slide category
  const filteredPhotos = photos.filter(p => !isSlideCategory(p.category));
  if (filteredPhotos.length === 0) {
    handleEmptyGallery();
    return;
  }

  // 1. Generate category filter buttons from Google Drive subfolders
  const categories = [...new Set(filteredPhotos.map(p => p.category || 'General'))];
  const filterContainer = document.getElementById('galleryFilterButtons');
  
  if (filterContainer && categories.length > 1) {
    let tabsHtml = `
      <button type="button" class="gallery-filter-btn active" data-filter="all" onclick="filterGallery('all', this)">
        <i class="fas fa-th"></i> All Photos (${filteredPhotos.length})
      </button>
    `;

    categories.forEach(cat => {
      const catClass = sanitizeCategory(cat);
      const count = filteredPhotos.filter(p => (p.category || 'General') === cat).length;
      const icon = getCategoryIcon(cat);

      tabsHtml += `
        <button type="button" class="gallery-filter-btn" data-filter="${catClass}" onclick="filterGallery('${catClass}', this)">
          <i class="${icon}"></i> ${escapeHtml(cat)} (${count})
        </button>
      `;
    });

    filterContainer.innerHTML = tabsHtml;
  } else if (filterContainer) {
    filterContainer.innerHTML = '';
  }

  // 2. Render Google Drive image cards
  const galleryCardsHtml = filteredPhotos.map(photo => {
    const cat = photo.category || 'General';
    const catClass = sanitizeCategory(cat);
    
    // Direct Google CDN links
    const thumbUrl = photo.thumbnailUrl || (photo.id ? `https://lh3.googleusercontent.com/d/${photo.id}=s600` : photo.src);
    const fullUrl = photo.fullUrl || (photo.id ? `https://lh3.googleusercontent.com/d/${photo.id}=s1600` : (photo.fullSrc || photo.src));
    const fallbackThumb = photo.id ? `https://drive.google.com/thumbnail?id=${photo.id}&sz=w800` : photo.src;

    let badgeClass = 'badge-upst';
    if (/campus|infra/i.test(cat)) badgeClass = 'badge-upst';
    else if (/event|celebrat|jubilee/i.test(cat)) badgeClass = 'badge-hm';
    else if (/art|cultur|kalotsavam/i.test(cat)) badgeClass = 'badge-director';
    else if (/sport|activit|athlet/i.test(cat)) badgeClass = 'badge-lpst';
    else if (/academ|smart|class/i.test(cat)) badgeClass = 'badge-upst';

    return `
      <div class="gallery-card gallery-item drive-gallery-item ${catClass}" onclick="openLightbox('${fullUrl}', '${escapeHtml(photo.title)}')">
        <div class="gallery-img-box">
          <img src="${thumbUrl}" 
               alt="${escapeHtml(photo.title)}" 
               loading="lazy" 
               referrerpolicy="no-referrer"
               onerror="if(!this.dataset.tried){this.dataset.tried=1;this.src='${fallbackThumb}';}">
          <div class="gallery-overlay"><i class="fas fa-search-plus"></i></div>
        </div>
        <div class="gallery-info">
          <span class="designation-badge ${badgeClass}" style="margin-bottom: 0.5rem; display: inline-block;">${escapeHtml(cat)}</span>
          <h3 style="font-size: 1.05rem; color: var(--primary-navy); margin-bottom: 0; line-height: 1.4;">${escapeHtml(photo.title)}</h3>
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = galleryCardsHtml;
}

function getCategoryIcon(cat) {
  const c = String(cat).toLowerCase();
  if (/campus|build|infra/i.test(c)) return 'fas fa-university';
  if (/event|jubilee|celebrat|stage/i.test(c)) return 'fas fa-glass-cheers';
  if (/sport|activit|athlet|yoga/i.test(c)) return 'fas fa-running';
  if (/kalotsavam|art|dance|cultur/i.test(c)) return 'fas fa-palette';
  if (/academic|class|smart|lab/i.test(c)) return 'fas fa-laptop';
  return 'fas fa-images';
}

function sanitizeCategory(cat) {
  if (!cat) return 'cat-general';
  return 'cat-' + String(cat).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
}

/* ==========================================================================
   7. Global Lightbox & Filter Helpers
   ========================================================================== */
window.filterGallery = function(category, btn) {
  const buttons = document.querySelectorAll('.gallery-filter-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    if (category === 'all' || item.classList.contains(category)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
};

window.openLightbox = function(imgSrc, caption) {
  let modal = document.getElementById('imageLightboxModal');
  let modalImg = document.getElementById('lightboxImage');
  if (modal && modalImg) {
    modal.style.display = 'flex';
    modalImg.src = imgSrc;
    modalImg.alt = caption || 'Expanded Photo View';
  }
};

window.closeLightbox = function(e) {
  if (e && e.target && e.target.id === 'imageLightboxModal') {
    document.getElementById('imageLightboxModal').style.display = 'none';
  }
};

window.closeLightboxDirect = function() {
  const modal = document.getElementById('imageLightboxModal');
  if (modal) modal.style.display = 'none';
};

// Lightbox Escape key listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeLightboxDirect();
  }
});

/* ==========================================================================
   8. Video Player Modal Logic (Global on window)
   ========================================================================== */
window.openVideoModal = function(videoId, title) {
  let modal = document.getElementById('videoPlayerModal');
  if (!modal) {
    createVideoModal();
    modal = document.getElementById('videoPlayerModal');
  }

  const iframe = document.getElementById('videoModalIframe');
  const titleElem = document.getElementById('videoModalTitle');

  if (iframe && videoId) {
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  }
  if (titleElem) {
    titleElem.textContent = title || 'School Video';
  }

  modal.classList.add('active');
};

window.closeVideoModal = function() {
  const modal = document.getElementById('videoPlayerModal');
  const iframe = document.getElementById('videoModalIframe');
  if (modal) {
    modal.classList.remove('active');
  }
  if (iframe) {
    iframe.src = '';
  }
};

function createVideoModal() {
  const modalHtml = `
    <div class="modal-backdrop video-modal-backdrop" id="videoPlayerModal" onclick="if(event.target===this)closeVideoModal()">
      <div class="modal-content video-modal-content">
        <div class="video-modal-header">
          <h3 id="videoModalTitle" style="margin: 0; font-size: 1.15rem; color: #ffffff; text-align: left;">UPGS Video</h3>
          <button type="button" class="video-modal-close" onclick="closeVideoModal()" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="video-responsive-wrap">
          <iframe id="videoModalIframe" src="" title="UPGS Video Player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });
}

/* ==========================================================================
   Storage & Utility Helpers
   ========================================================================== */
function getLocalCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function setLocalCache(data) {
  try {
    data._cachedAt = Date.now();
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    // Quota exceeded
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
