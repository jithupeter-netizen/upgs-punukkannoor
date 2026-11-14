const fs = require('fs');
const path = require('path');

const ROOT_URL = 'https://upgspunukkonnoor.com';
const DEFAULT_IMAGE = `${ROOT_URL}/images/Up%20school.webp`;
const STANDARDIZED_ADDRESS = 'UPGS Punukkonnoor, Punukkannoor, Alummoodu P.O., Kundara, Kollam - 691577';

const pagesMeta = {
  'about.html': {
    title: 'About Us - UPGS Punukkonnoor (Punukkannoor) | 100 Years of Excellence',
    description: 'Discover the 100-year legacy of UPGS Punukkonnoor (Punukkannoor), Alummoodu, Kundara, Kollam (1926–2026). School history, Headmaster message, vision, and centenary milestones.',
    canonical: `${ROOT_URL}/about.html`
  },
  'curriculum.html': {
    title: 'Curriculum & Academics - UPGS Punukkonnoor (Punukkannoor)',
    description: 'Academic curriculum and digital learning at UPGS Punukkonnoor (Punukkannoor), Alummoodu, Kundara. SCERT Kerala syllabus, smart classrooms, IT lab, and sports turf.',
    canonical: `${ROOT_URL}/curriculum.html`
  },
  'staff.html': {
    title: 'Faculty & Staff Directory - UPGS Punukkonnoor (Punukkannoor)',
    description: 'Meet the dedicated headmistress, teachers, and staff members of UPGS Punukkonnoor (Punukkannoor), Alummoodu, Kundara, Kollam.',
    canonical: `${ROOT_URL}/staff.html`
  },
  'pta.html': {
    title: 'PTA & MPTCA Leadership - UPGS Punukkonnoor (Punukkannoor)',
    description: 'Parent-Teacher Association (PTA) and Mother-PTA (MPTCA) of UPGS Punukkonnoor (Punukkannoor), Alummoodu, Kundara. Partnering for student excellence.',
    canonical: `${ROOT_URL}/pta.html`
  },
  'virtual-tour.html': {
    title: '360° Virtual Campus Tour - UPGS Punukkonnoor (Punukkannoor)',
    description: 'Immersive 360° interactive virtual campus tour of UPGS Punukkonnoor (Punukkannoor): Main UP Section, Balaji LP School, and Sports Turf.',
    canonical: `${ROOT_URL}/virtual-tour.html`
  },
  'gallery.html': {
    title: 'Photo & Video Gallery - UPGS Punukkonnoor (Punukkannoor)',
    description: 'Explore photo galleries of centenary celebrations, arts, Kalolsavam, Onam, sports meets, and student activities at UPGS Punukkonnoor (Punukkannoor).',
    canonical: `${ROOT_URL}/gallery.html`
  },
  'alumni.html': {
    title: 'Centenary Alumni Portal - UPGS Punukkonnoor (Punukkannoor)',
    description: 'Connect and register for the UPGS Punukkonnoor (Punukkannoor) 100th Centenary Alumni Directory (1926–2026). Reconnect with classmates and teachers.',
    canonical: `${ROOT_URL}/alumni.html`
  },
  'contact.html': {
    title: 'Contact Us & Location - UPGS Punukkonnoor (Punukkannoor)',
    description: 'Get in touch with UPGS Punukkonnoor. School address: Punukkannoor, Alummoodu P.O., Kundara, Kollam - 691577. Phone: +91 9447135592, Email, and Google Maps direction.',
    canonical: `${ROOT_URL}/contact.html`
  }
};

for (const [filename, meta] of Object.entries(pagesMeta)) {
  if (!fs.existsSync(filename)) continue;
  let content = fs.readFileSync(filename, 'utf8');

  // 1. Update Title & Meta Description & Canonical
  content = content.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);
  content = content.replace(/<meta name=["']description["'][\s\S]*?>/i, `<meta name="description" content="${meta.description}">`);

  // Remove existing canonical & social tags to prevent duplication
  content = content.replace(/<link rel=["']canonical["'][\s\S]*?>/ig, '');
  content = content.replace(/<meta property=["']og:[^"']*["'][\s\S]*?>/ig, '');
  content = content.replace(/<meta name=["']twitter:[^"']*["'][\s\S]*?>/ig, '');

  const socialBlock = `
  <link rel="canonical" href="${meta.canonical}">

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${meta.canonical}">
  <meta property="og:site_name" content="UPGS Punukkonnoor">
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:image" content="${DEFAULT_IMAGE}">
  <meta property="og:locale" content="en_IN">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="${DEFAULT_IMAGE}">`;

  content = content.replace(/<\/head>/i, `${socialBlock}\n</head>`);

  // 2. Standardize footer address
  content = content.replace(/<p style="margin-bottom: 0\.5rem; font-size: 0\.95rem;">UPGS[\s\S]*?<\/p>/i, `<p style="margin-bottom: 0.5rem; font-size: 0.95rem;">${STANDARDIZED_ADDRESS}</p>`);

  // Special update for contact.html card address
  if (filename === 'contact.html') {
    content = content.replace(/Punukkonnoor,<br>\s*Alummoodu P\.O\.,<br>\s*Kollam 691577/i, `Punukkannoor,<br>\n                Alummoodu P.O., Kundara,<br>\n                Kollam, Kerala - 691577`);
  }

  fs.writeFileSync(filename, content, 'utf8');
  console.log(`Updated SEO metadata and footer for: ${filename}`);
}

console.log('All pages successfully updated with SEO metadata & standardized addresses.');
