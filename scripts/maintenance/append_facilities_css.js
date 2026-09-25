const fs = require('fs');

const luxuryFacilitiesCSS = `

/* ==========================================================================
   Luxury Glassmorphism Campus Excellence / Facilities Showcase
   ========================================================================== */
.facilities-luxury-section {
  position: relative;
  padding: 6.5rem 0;
  background: radial-gradient(circle at 12% 18%, rgba(59, 130, 246, 0.18) 0%, transparent 45%),
              radial-gradient(circle at 88% 82%, rgba(245, 158, 11, 0.14) 0%, transparent 45%),
              radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 55%),
              linear-gradient(135deg, #050e1d 0%, #0a192f 50%, #081426 100%);
  color: #ffffff;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.facilities-luxury-section::before {
  content: '';
  position: absolute;
  top: -150px;
  right: -100px;
  width: 450px;
  height: 450px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, transparent 70%);
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
  background: radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%);
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
  padding: 0.4rem 1.15rem;
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.35);
  border-radius: 50px;
  color: #fbbf24;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.facilities-luxury-title {
  font-size: 2.75rem;
  font-weight: 800;
  font-family: var(--font-heading);
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
}

.facilities-luxury-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
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

/* Glassmorphism Facility Card */
.facility-glass-card {
  position: relative;
  background: rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 22px;
  padding: 2.25rem 1.65rem 1.85rem;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.facility-glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--card-accent, #38bdf8), transparent);
  opacity: 0.4;
  transition: opacity 0.3s ease, height 0.3s ease;
}

.facility-glass-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.065);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45), 0 0 25px var(--card-glow, rgba(56, 189, 248, 0.2));
}

.facility-glass-card:hover::before {
  opacity: 1;
  height: 4px;
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
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: transform 0.35s ease;
}

.facility-glass-card:hover .facility-icon-medallion {
  transform: scale(1.1) rotate(4deg);
}

.facility-metric-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.32rem 0.8rem;
  border-radius: 30px;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
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
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 800;
  font-family: var(--font-heading);
  margin-bottom: 0.75rem;
  line-height: 1.25;
}

.facility-card-desc {
  color: #94a3b8;
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
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.facility-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.65rem;
  border-radius: 20px;
  font-size: 0.76rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  transition: all 0.25s ease;
}

.facility-glass-card:hover .facility-chip {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

/* Bottom Virtual Tour Banner inside Section */
.facilities-tour-banner {
  margin-top: 3.5rem;
  background: rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 22px;
  padding: 1.75rem 2.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.04);
}

.tour-banner-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.tour-banner-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.35);
}

.tour-banner-title {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
}

.tour-banner-desc {
  color: #94a3b8;
  font-size: 0.92rem;
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
  box-shadow: 0 8px 22px rgba(245, 158, 11, 0.4);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  flex-shrink: 0;
}

.tour-banner-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 28px rgba(245, 158, 11, 0.55);
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

fs.appendFileSync('css/components.css', luxuryFacilitiesCSS, 'utf8');
console.log('Appended luxury facilities CSS to css/components.css');
