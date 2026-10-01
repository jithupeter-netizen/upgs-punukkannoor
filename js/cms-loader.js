/* ==========================================================================
   UPGS Punukkonnoor — Headless CMS Client Loader
   Connects to Google Sheets & Google Drive Backend
   Features:
   - Dynamic Google Drive Photo Gallery (Streamed directly from Google Drive CDN)
   - Real-time Category Filtering from Drive Subfolders
   - Announcements Ticker
   - Dynamic Leadership Messages
   - Testimonials Showcase
   - YouTube Video Player Showcase with Modal
   - Instant LocalStorage Caching & Background Revalidation
   ========================================================================== */

const GOOGLE_CMS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzZ7sw_OCbXA5_NS6JhmDoh2IZs0Br8EHVHoKnoveu0tVMaN-vmTclej--00Q2Jd7G16A/exec';
const CACHE_KEY = 'upgs_cms_cache_v1';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Initializes CMS Content on DOM Ready
 */
document.addEventListener('DOMContentLoaded', () => {
  initCMS();
});

async function initCMS() {
  const isGalleryPage = window.location.pathname.includes('gallery');

  // 1. Render immediately from cache if available
  const cachedData = getLocalCache();
  if (cachedData) {
    applyCMSData(cachedData);
  }

  // 2. Fetch live data from Google Apps Script
  try {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const hasEmptyGallery = !cachedData || !cachedData.gallery || cachedData.gallery.length === 0;
    const isStale = isLocalhost || (isGalleryPage && hasEmptyGallery) || !cachedData || (Date.now() - cachedData._cachedAt > CACHE_TTL_MS);

    if (isStale) {
      const freshData = await fetchFromGoogle(isLocalhost || hasEmptyGallery);
      if (freshData && freshData.status === 'success' && freshData.data) {
        setLocalCache(freshData.data);
        applyCMSData(freshData.data);
      } else if (isGalleryPage) {
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

  if (window.location.pathname.includes('gallery')) {
    if (data.gallery && data.gallery.length > 0) {
      renderDriveGallery(data.gallery);
    } else {
      handleEmptyGallery();
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
   5. Google Drive Photo Gallery Renderer
   Direct CDN Streaming: https://lh3.googleusercontent.com/d/FILE_ID
   ========================================================================== */
function renderDriveGallery(photos) {
  const grid = document.getElementById('galleryGrid');
  if (!grid || !photos || photos.length === 0) {
    handleEmptyGallery();
    return;
  }

  // 1. Generate category filter buttons from Google Drive subfolders
  const categories = [...new Set(photos.map(p => p.category || 'General'))];
  const filterContainer = document.getElementById('galleryFilterButtons');
  
  if (filterContainer && categories.length > 1) {
    let tabsHtml = `
      <button type="button" class="gallery-filter-btn active" data-filter="all" onclick="filterGallery('all', this)">
        <i class="fas fa-th"></i> All Photos (${photos.length})
      </button>
    `;

    categories.forEach(cat => {
      const catClass = sanitizeCategory(cat);
      const count = photos.filter(p => (p.category || 'General') === cat).length;
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
  const galleryCardsHtml = photos.map(photo => {
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
  if (!cat) return 'general';
  const clean = String(cat).toLowerCase();
  if (clean.includes('campus') || clean.includes('infra')) return 'campus';
  if (clean.includes('event') || clean.includes('celebrat') || clean.includes('jubilee')) return 'events';
  if (clean.includes('art') || clean.includes('cultur') || clean.includes('kalotsavam')) return 'arts';
  if (clean.includes('sport') || clean.includes('activit') || clean.includes('athlet') || clean.includes('yoga')) return 'sports';
  if (clean.includes('academ') || clean.includes('class') || clean.includes('smart') || clean.includes('lab')) return 'academic';
  return clean.replace(/[^a-z0-9]/g, '');
}

/* ==========================================================================
   6. Global Lightbox & Filter Helpers
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
   7. Video Player Modal Logic (Global on window)
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
