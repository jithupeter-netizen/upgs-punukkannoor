const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'index.html',
  'about.html',
  'curriculum.html',
  'staff.html',
  'gallery.html',
  'virtual-tour.html',
  'alumni.html',
  'pta.html',
  'contact.html'
];

console.log('=== FULL CROSS-PAGE AUDIT ===\n');

let totalIssues = 0;

htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`[ERROR] File missing: ${file}`);
    totalIssues++;
    return;
  }

  const content = fs.readFileSync(file, 'utf8');

  // 1. Title
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;
  if (!title) {
    console.warn(`[WARN] ${file}: Missing <title> tag`);
    totalIssues++;
  }

  // 2. Meta Description
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const desc = descMatch ? descMatch[1].trim() : null;
  if (!desc) {
    console.warn(`[WARN] ${file}: Missing <meta name="description"> tag`);
    totalIssues++;
  }

  // 3. Check internal links
  const linkRegex = /<a\b[^>]*href=["']([^"'#:]+)["']/gi;
  let linkMatch;
  const brokenLinks = [];
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    let href = linkMatch[1].trim();
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    // strip query or hash
    const cleanPath = href.split('?')[0].split('#')[0];
    if (!cleanPath) continue;
    if (!fs.existsSync(cleanPath)) {
      brokenLinks.push(href);
      totalIssues++;
    }
  }

  // 4. Check image sources
  const imgRegex = /<img\b[^>]*src=["']([^"']+)["']/gi;
  let imgMatch;
  const brokenImages = [];
  while ((imgMatch = imgRegex.exec(content)) !== null) {
    let src = imgMatch[1].trim();
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) continue;
    const cleanImgPath = src.split('?')[0].split('#')[0];
    if (!fs.existsSync(decodeURIComponent(cleanImgPath))) {
      brokenImages.push(src);
      totalIssues++;
    }
  }

  console.log(`✓ ${file}`);
  console.log(`   Title: "${title || 'N/A'}"`);
  console.log(`   Meta:  "${(desc || 'N/A').slice(0, 65)}..."`);
  if (brokenLinks.length > 0) {
    console.error(`   ❌ Broken Links (${brokenLinks.length}):`, brokenLinks);
  } else {
    console.log(`   ✓ All internal links valid`);
  }
  if (brokenImages.length > 0) {
    console.error(`   ❌ Broken Images (${brokenImages.length}):`, brokenImages);
  } else {
    console.log(`   ✓ All local images verified`);
  }
  console.log('');
});

console.log(`Audit Finished. Total Issues Found: ${totalIssues}`);
