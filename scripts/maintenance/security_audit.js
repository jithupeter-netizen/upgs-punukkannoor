const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('=== REVERSE TABNAPPING AUDIT (target="_blank") ===');
let missingRelCount = 0;
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const linkRegex = /<a\b([^>]*)>/gi;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const attrs = match[1];
    if (/target=["']_blank["']/i.test(attrs)) {
      const relMatch = attrs.match(/rel=["']([^"']*)["']/i);
      const relValue = relMatch ? relMatch[1] : '';
      const hasNoopener = /noopener/i.test(relValue);
      const hasNoreferrer = /noreferrer/i.test(relValue);
      if (!hasNoopener || !hasNoreferrer) {
        missingRelCount++;
        const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
        const href = hrefMatch ? hrefMatch[1] : 'unknown';
        console.log(`[${file}] Insecure link: href="${href}" -> rel="${relValue}"`);
      }
    }
  }
});
console.log(`Total insecure target="_blank" links: ${missingRelCount}`);
