const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('=== SCRIPT IMPORTS AUDIT ===');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  const externalScripts = [];
  let inlineScriptCount = 0;
  let inlineScriptBytes = 0;

  while ((match = scriptRegex.exec(content)) !== null) {
    const attrs = match[1];
    const body = match[2].trim();
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    if (srcMatch) {
      externalScripts.push({
        src: srcMatch[1],
        defer: /defer/i.test(attrs),
        async: /async/i.test(attrs),
        module: /type=["']module["']/i.test(attrs)
      });
    } else if (body.length > 0) {
      inlineScriptCount++;
      inlineScriptBytes += body.length;
    }
  }

  console.log(`\nPage: ${f}`);
  console.log(`  External Scripts (${externalScripts.length}):`);
  externalScripts.forEach(s => {
    console.log(`    - ${s.src} [defer: ${s.defer}, async: ${s.async}, module: ${s.module}]`);
  });
  if (inlineScriptCount > 0) {
    console.log(`  Inline Scripts: ${inlineScriptCount} block(s), ~${inlineScriptBytes} chars`);
  }
});
