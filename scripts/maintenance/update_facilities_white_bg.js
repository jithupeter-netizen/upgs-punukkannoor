const fs = require('fs');

// 1. Update css/components.css for white background luxury styling
let css = fs.readFileSync('css/components.css', 'utf8');

const targetCSSStart = '/* ==========================================================================\n   Luxury Glassmorphism Campus Excellence / Facilities Showcase';
const splitIndex = css.indexOf('Luxury Glassmorphism Campus Excellence / Facilities Showcase');

if (splitIndex !== -1) {
  // Find beginning of comment
  const commentStart = css.lastIndexOf('/*', splitIndex);
  css = css.slice(0, commentStart);
}

const lightLuxuryFacilitiesCSS = `/* ==========================================================================
   Luxury White Background Campus Excellence / Facilities Showcase
   ========================================================================== */
.facilities-luxury-section {
  position: relative;
  padding: 6.5rem 0;
  background: radial-gradient(circle at 10% 20%, rgba(224, 242, 254, 0.6) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(254, 243, 199, 0.5) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(241, 245, 249, 0.8) 0%, transparent 60%),
              linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%);
  color: #0f172a;
  overflow: hidden;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.facilities-luxury-section::before {
  content: '';
  position: absolute;
  top: -150px;
  right: -100px;
  width: 450px;
  height: 450px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%);
  pointer-events: none;
  filter: blur(40px);
}

.facilities-luxury-section::after {
  content: '';
  position: absolute;
  bottom: -150px;
  left: -100px;
  width: 450px;
  height: 450px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%);
  pointer-events: none;
  filter: blur(40px);
}

.facilities-luxury-header {
  text-align: center;
  max-width: 780px;
  margin: 0 auto 3.5rem;
  position: relative;
  z-index: 2;
}

.facilities-tag-luxury {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1.25rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #fcd34d;
  border-radius: 50px;
  color: #b45309;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
}

.facilities-luxury-title {
  font-size: 2.75rem;
  font-weight: 800;
  font-family: var(--font-heading);
  color: var(--primary-navy, #0a192f);
  line-height: 1.2;
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
}

.facilities-luxury-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0 auto;
}

.facilities-grid-luxury {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.75rem;
  position: relative;
  z-index: 2;
}

/* Luxury Card with White/Frosted Aesthetics */
.facility-glass-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  padding: 2.25rem 1.65rem 1.85rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.facility-glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--card-accent, #0284c7), var(--card-glow, #38bdf8));
  opacity: 0.85;
  transition: height 0.3s ease;
}

.facility-glass-card:hover {
  transform: translateY(-8px);
  border-color: #cbd5e1;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.12), 0 0 25px var(--card-glow, rgba(2, 132, 199, 0.15));
}

.facility-glass-card:hover::before {
  height: 6px;
}

/* Card Header: Medallion + Metric Badge */
.facility-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.facility-icon-medallion {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.45rem;
  transition: transform 0.35s ease;
}

.facility-glass-card:hover .facility-icon-medallion {
  transform: scale(1.1) rotate(4deg);
}

.facility-metric-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.85rem;
  border-radius: 30px;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  animation: pulseGlow 1.8s infinite ease-in-out;
}

@keyframes pulseGlow {
  0%, 100% { transform: scale(0.9); opacity: 0.6; }
  50% { transform: scale(1.3); opacity: 1; }
}

/* Card Content */
.facility-card-title {
  color: var(--primary-navy, #0a192f);
  font-size: 1.3rem;
  font-weight: 800;
  font-family: var(--font-heading);
  margin-bottom: 0.75rem;
  line-height: 1.25;
}

.facility-card-desc {
  color: #64748b;
  font-size: 0.93rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

/* Micro-Feature Chips */
.facility-chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  padding-top: 1.15rem;
  border-top: 1px solid #f1f5f9;
}

.facility-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.65rem;
  border-radius: 20px;
  font-size: 0.76rem;
  font-weight: 600;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  transition: all 0.25s ease;
}

.facility-glass-card:hover .facility-chip {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #0f172a;
}

/* Bottom Virtual Tour Banner inside Section */
.facilities-tour-banner {
  margin-top: 3.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-left: 5px solid #f59e0b;
  border-radius: 22px;
  padding: 1.75rem 2.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.06);
}

.tour-banner-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.tour-banner-icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.45rem;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.tour-banner-title {
  color: var(--primary-navy, #0a192f);
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
}

.tour-banner-desc {
  color: #64748b;
  font-size: 0.93rem;
  margin: 0;
}

.tour-banner-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 1.75rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  font-weight: 800;
  font-size: 0.95rem;
  text-decoration: none;
  letter-spacing: 0.02em;
  box-shadow: 0 8px 22px rgba(245, 158, 11, 0.35);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  flex-shrink: 0;
}

.tour-banner-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 28px rgba(245, 158, 11, 0.5);
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

/* Responsiveness for Facilities Showcase */
@media (max-width: 1024px) {
  .facilities-grid-luxury {
    grid-template-columns: repeat(2, 1fr);
  }
  .facilities-luxury-title {
    font-size: 2.25rem;
  }
}

@media (max-width: 768px) {
  .facilities-luxury-section {
    padding: 4.5rem 0;
  }
  .facilities-grid-luxury {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  .facilities-tour-banner {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  .tour-banner-left {
    flex-direction: column;
    text-align: center;
  }
  .tour-banner-btn {
    width: 100%;
    justify-content: center;
  }
}
`;

fs.writeFileSync('css/components.css', css + '\n\n' + lightLuxuryFacilitiesCSS, 'utf8');
console.log('Updated css/components.css with white background luxury styles.');

// 2. Update index.html facilities section markup with light-themed accents
let indexHtml = fs.readFileSync('index.html', 'utf8');

const lightFacilitiesHTML = `  <!-- Facilities Section: Luxury White Campus Excellence Showcase -->
  <section class="facilities-luxury-section" id="facilities">
    <div class="container">
      <div class="facilities-luxury-header">
        <span class="facilities-tag-luxury">
          <i class="fas fa-gem"></i> CAMPUS EXCELLENCE & INFRASTRUCTURE
        </span>
        <h2 class="facilities-luxury-title">Modern Facilities for Holistic Growth</h2>
        <p class="facilities-luxury-subtitle">
          From Little Kites smart classrooms and high-tech STEM labs to rich bilingual libraries and expansive sports arenas, we empower every student through state-of-the-art experiential learning.
        </p>
      </div>

      <div class="facilities-grid-luxury">
        <!-- Facility Card 1: Digital Classrooms -->
        <div class="facility-glass-card" style="--card-accent: #0284c7; --card-glow: rgba(2, 132, 199, 0.2);">
          <div class="facility-card-top">
            <div class="facility-icon-medallion" style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); color: #0284c7; border: 1px solid #7dd3fc; box-shadow: 0 6px 16px rgba(2, 132, 199, 0.15);">
              <i class="fas fa-chalkboard-teacher"></i>
            </div>
            <div class="facility-metric-badge" style="border-color: #bae6fd; background: #f0f9ff; color: #0369a1;">
              <span class="pulse-dot" style="background: #0284c7; box-shadow: 0 0 8px #0284c7;"></span>
              100% Smart
            </div>
          </div>
          <h3 class="facility-card-title">Digital Classrooms</h3>
          <p class="facility-card-desc">
            Equipped with state-of-the-art Little Kites multimedia projection systems, audio-visual smart screens, and interactive SCERT digital content for engaging daily lessons.
          </p>
          <div class="facility-chips-wrap">
            <span class="facility-chip"><i class="fas fa-check-circle" style="color: #0284c7;"></i> Little Kites Tech</span>
            <span class="facility-chip"><i class="fas fa-check-circle" style="color: #0284c7;"></i> Smart Projectors</span>
            <span class="facility-chip"><i class="fas fa-check-circle" style="color: #0284c7;"></i> AV Interactive</span>
          </div>
        </div>

        <!-- Facility Card 2: Computer & Science Lab -->
        <div class="facility-glass-card" style="--card-accent: #059669; --card-glow: rgba(5, 150, 105, 0.2);">
          <div class="facility-card-top">
            <div class="facility-icon-medallion" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #059669; border: 1px solid #6ee7b7; box-shadow: 0 6px 16px rgba(5, 150, 105, 0.15);">
              <i class="fas fa-laptop-code"></i>
            </div>
            <div class="facility-metric-badge" style="border-color: #a7f3d0; background: #ecfdf5; color: #047857;">
              <span class="pulse-dot" style="background: #059669; box-shadow: 0 0 8px #059669;"></span>
              15+ Workstations
            </div>
          </div>
          <h3 class="facility-card-title">Science & Computer Lab</h3>
          <p class="facility-card-desc">
            High-speed networked computing lab fostering early digital literacy and coding, paired with hands-on experimental science kits and laboratory apparatus.
          </p>
          <div class="facility-chips-wrap">
            <span class="facility-chip"><i class="fas fa-check-circle" style="color: #059669;"></i> Broadband Fiber</span>
            <span class="facility-chip"><i class="fas fa-check-circle" style="color: #059669;"></i> STEM Science Kits</span>
            <span class="facility-chip"><i class="fas fa-check-circle" style="color: #059669;"></i> Digital Literacy</span>
          </div>
        </div>

        <!-- Facility Card 3: Library & Reading Sanctuary -->
        <div class="facility-glass-card" style="--card-accent: #d97706; --card-glow: rgba(217, 119, 6, 0.2);">
          <div class="facility-card-top">
            <div class="facility-icon-medallion" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #d97706; border: 1px solid #fcd34d; box-shadow: 0 6px 16px rgba(217, 119, 6, 0.15);">
              <i class="fas fa-book-reader"></i>
            </div>
            <div class="facility-metric-badge" style="border-color: #fde68a; background: #fffbeb; color: #b45309;">
              <span class="pulse-dot" style="background: #d97706; box-shadow: 0 0 8px #d97706;"></span>
              2,000+ Titles
            </div>
          </div>
          <h3 class="facility-card-title">Library & Reading Sanctuary</h3>
          <p class="facility-card-desc">
            A rich, inspiring treasury of children's literature, Malayalam & English classics, national periodicals, encyclopedia collections, and active student reading circles.
          </p>
          <div class="facility-chips-wrap">
            <span class="facility-chip"><i class="fas fa-check-circle" style="color: #d97706;"></i> Bilingual Classics</span>
            <span class="facility-chip"><i class="fas fa-check-circle" style="color: #d97706;"></i> Daily Periodicals</span>
            <span class="facility-chip"><i class="fas fa-check-circle" style="color: #d97706;"></i> Reader Club</span>
          </div>
        </div>

        <!-- Facility Card 4: Sports Arena & Eco-Campus -->
        <div class="facility-glass-card" style="--card-accent: #e11d48; --card-glow: rgba(225, 29, 72, 0.2);">
          <div class="facility-card-top">
            <div class="facility-icon-medallion" style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); color: #e11d48; border: 1px solid #fda4af; box-shadow: 0 6px 16px rgba(225, 29, 72, 0.15);">
              <i class="fas fa-running"></i>
            </div>
            <div class="facility-metric-badge" style="border-color: #fecaca; background: #fff1f2; color: #be123c;">
              <span class="pulse-dot" style="background: #e11d48; box-shadow: 0 0 8px #e11d48;"></span>
              Centenary Grounds
            </div>
          </div>
          <h3 class="facility-card-title">Sports Arena & Eco-Campus</h3>
          <p class="facility-card-desc">
            Expansive open playground dedicated to athletics, football, and physical fitness, harmonized with active Scouts & Guides, Junior Red Cross, and verdant Eco Clubs.
          </p>
          <div class="facility-chips-wrap">
            <span class="facility-chip"><i class="fas fa-check-circle" style="color: #e11d48;"></i> Athletic Grounds</span>
            <span class="facility-chip"><i class="fas fa-check-circle" style="color: #e11d48;"></i> Scouts & Guides</span>
            <span class="facility-chip"><i class="fas fa-check-circle" style="color: #e11d48;"></i> Eco Herbal Garden</span>
          </div>
        </div>
      </div>

      <!-- Integrated 360° Virtual Campus Experience Banner -->
      <div class="facilities-tour-banner">
        <div class="tour-banner-left">
          <div class="tour-banner-icon">
            <i class="fas fa-vr-cardboard"></i>
          </div>
          <div>
            <h4 class="tour-banner-title">Step Inside Our Campus in Full 360° Virtual Reality</h4>
            <p class="tour-banner-desc">
              Experience an interactive inside-out tour of our classrooms, laboratories, and campus grounds right from your phone or laptop.
            </p>
          </div>
        </div>
        <a href="virtual-tour.html" class="tour-banner-btn">
          <span>Explore 360° Campus Tour</span>
          <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  </section>`;

indexHtml = indexHtml.replace(/<!-- Facilities Section: Luxury Glassmorphic Campus Excellence Showcase -->[\s\S]*?<\/section>/, lightFacilitiesHTML);
fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Updated index.html facilities section.');
