import fs from 'fs';

let html = fs.readFileSync('virtual-tour.html', 'utf8');

// Match and remove grid-3 cards section
const startIndex = html.indexOf('<div class="grid-3"');
const endIndex = html.indexOf('</div>\r\n    </div>\r\n  </section>') !== -1 
  ? html.indexOf('</div>\r\n    </div>\r\n  </section>')
  : html.indexOf('</div>\n    </div>\n  </section>');

if (startIndex !== -1 && endIndex !== -1) {
  html = html.substring(0, startIndex) + html.substring(endIndex + 6);
  fs.writeFileSync('virtual-tour.html', html, 'utf8');
  console.log('Successfully removed grid-3 cards!');
} else {
  console.log('Indices:', startIndex, endIndex);
}
