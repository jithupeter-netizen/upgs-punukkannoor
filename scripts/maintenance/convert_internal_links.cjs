const fs = require('fs');

const htmlFiles = [
  'index.html',
  'about.html',
  'curriculum.html',
  'staff.html',
  'pta.html',
  'virtual-tour.html',
  'gallery.html',
  'alumni.html',
  'contact.html'
];

const linkReplacements = [
  { from: /href="index\.html(#.*?)?"/g, to: 'href="/$1"' },
  { from: /href="about\.html(#.*?)?"/g, to: 'href="/about$1"' },
  { from: /href="curriculum\.html(#.*?)?"/g, to: 'href="/curriculum$1"' },
  { from: /href="staff\.html(#.*?)?"/g, to: 'href="/staff$1"' },
  { from: /href="pta\.html(#.*?)?"/g, to: 'href="/pta$1"' },
  { from: /href="virtual-tour\.html(#.*?)?"/g, to: 'href="/virtual-tour$1"' },
  { from: /href="gallery\.html(#.*?)?"/g, to: 'href="/gallery$1"' },
  { from: /href="alumni\.html(#.*?)?"/g, to: 'href="/alumni$1"' },
  { from: /href="contact\.html(#.*?)?"/g, to: 'href="/contact$1"' }
];

for (const file of htmlFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  let count = 0;

  for (const { from, to } of linkReplacements) {
    const matches = content.match(from);
    if (matches) {
      count += matches.length;
      content = content.replace(from, (match, hash) => {
        const h = hash || '';
        return to.replace('$1', h);
      });
    }
  }

  // Ensure clean root href
  content = content.replace(/href="\/\/"/g, 'href="/"');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}: ${count} internal links converted to clean URLs.`);
}
console.log('All internal links converted.');
