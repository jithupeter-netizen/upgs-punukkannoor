const fs = require('fs');

console.log('=== SECURITY HARDENING SCRIPT ===');

// 1. Fix all target="_blank" in HTML files
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let totalLinksFixed = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let fileChanged = false;

  // Pattern A: target="_blank" rel="noopener" -> target="_blank" rel="noopener noreferrer"
  const relNoopenerRegex = /target=["']_blank["']\s+rel=["']noopener["']/gi;
  if (relNoopenerRegex.test(content)) {
    content = content.replace(relNoopenerRegex, 'target="_blank" rel="noopener noreferrer"');
    fileChanged = true;
  }

  // Pattern B: rel="noopener" target="_blank" -> rel="noopener noreferrer" target="_blank"
  const relBeforeRegex = /rel=["']noopener["']\s+target=["']_blank["']/gi;
  if (relBeforeRegex.test(content)) {
    content = content.replace(relBeforeRegex, 'rel="noopener noreferrer" target="_blank"');
    fileChanged = true;
  }

  // Pattern C: target="_blank" without any rel attribute
  const targetNoRelRegex = /<a\b((?:(?!rel=)[^>])*?)target=["']_blank["']((?:(?!rel=)[^>])*?)>/gi;
  content = content.replace(targetNoRelRegex, (match, p1, p2) => {
    // Only replace if 'rel=' is genuinely not in the tag
    if (!match.includes('rel=')) {
      fileChanged = true;
      return `<a${p1}target="_blank" rel="noopener noreferrer"${p2}>`;
    }
    return match;
  });

  if (fileChanged) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`[Fixed] Secured external links in ${file}`);
  }
});

// 2. Fix centenary-hub.js
let hubContent = fs.readFileSync('js/centenary-hub.js', 'utf8');
if (hubContent.includes('target="_blank" rel="noopener"')) {
  hubContent = hubContent.replace('target="_blank" rel="noopener"', 'target="_blank" rel="noopener noreferrer"');
  fs.writeFileSync('js/centenary-hub.js', hubContent, 'utf8');
  console.log('[Fixed] Secured WhatsApp link in js/centenary-hub.js');
}

// 3. Harden js/alumni-form.js
const hardenedAlumniForm = `/* UPGS Punukkonnoor - Alumni Data Collection Form Handler with Google Sheets Webhook */

// 👉 Google Apps Script Web App URL:
const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzPWgW7k2rj8zDVscQb9IdMK-3etUZ8LIbt3JGBVgsi0CocTAWSzPtjwJ7YmdhbQnw/exec';

/**
 * Sanitizes input string to prevent XSS and strip control characters
 * @param {string} str - Raw user input
 * @param {number} maxLen - Maximum allowable length
 * @returns {string} Sanitized string
 */
function sanitizeInput(str, maxLen = 200) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>\\/\\\\{}]/g, '') // Strip markup delimiters
    .trim()
    .slice(0, maxLen);
}

document.addEventListener('DOMContentLoaded', () => {
  const alumniForm = document.getElementById('alumni-registration-form');
  const passingYearSelect = document.getElementById('passing_year');

  // 1. Populate Batch Years (1926 to 2026)
  if (passingYearSelect) {
    const startYear = 1926;
    const endYear = 2026;
    
    for (let year = endYear; year >= startYear; year--) {
      const option = document.createElement('option');
      option.value = String(year);
      option.textContent = \`\${year} Batch\`;
      passingYearSelect.appendChild(option);
    }
  }

  // 2. Form Submission Handler
  if (alumniForm) {
    alumniForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const rawFullName = document.getElementById('full_name')?.value || '';
      const rawPassingYear = document.getElementById('passing_year')?.value || '';
      const rawPhoneNumber = document.getElementById('phone_number')?.value || '';
      const rawEmail = document.getElementById('email')?.value || '';
      const rawLocation = document.getElementById('location')?.value || '';
      const rawOccupation = document.getElementById('occupation')?.value || '';
      const rawMemories = document.getElementById('memories')?.value || '';

      // Sanitize fields
      const fullName = sanitizeInput(rawFullName, 100);
      const passingYear = parseInt(rawPassingYear, 10);
      const phoneNumber = sanitizeInput(rawPhoneNumber, 20);
      const email = sanitizeInput(rawEmail, 100);
      const location = sanitizeInput(rawLocation, 120);
      const occupation = sanitizeInput(rawOccupation, 120);
      const memories = sanitizeInput(rawMemories, 1000);

      // Validation
      if (!fullName || fullName.length < 2) {
        alert('Please enter a valid full name.');
        return;
      }

      if (isNaN(passingYear) || passingYear < 1926 || passingYear > 2026) {
        alert('Please select a valid passing batch year (1926 - 2026).');
        return;
      }

      // Validate phone number format (at least 7 digits)
      const phoneDigits = phoneNumber.replace(/\\D/g, '');
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        alert('Please enter a valid WhatsApp / contact phone number (at least 7 digits).');
        return;
      }

      // Validate email format if provided
      if (email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
        alert('Please enter a valid email address, or leave it blank.');
        return;
      }

      const submitBtn = alumniForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Submitting Securely...</span> <i class="fas fa-spinner fa-spin"></i>';
      }

      // Generate Cryptographically-Unpredictable Receipt ID
      const randBuf = new Uint16Array(1);
      window.crypto.getRandomValues(randBuf);
      const receiptId = 'UPGS100-ALM-' + (1000 + (randBuf[0] % 9000));

      const payload = {
        receiptId,
        fullName,
        passingYear,
        phoneNumber,
        email,
        location,
        occupation,
        memories,
        submittedAt: new Date().toISOString()
      };

      try {
        if (GOOGLE_SHEET_WEBHOOK_URL && GOOGLE_SHEET_WEBHOOK_URL.startsWith('http')) {
          // Send to Google Sheets Webhook with 12s timeout controller
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000);

          await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
          clearTimeout(timeoutId);
        } else {
          // Fallback simulation
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Show Success Modal
        showSuccessModal(fullName, receiptId, passingYear);
        alumniForm.reset();

      } catch (err) {
        console.error('Submission error:', err);
        if (err.name === 'AbortError') {
          alert('Network request timed out. Please check your internet connection and try again.');
        } else {
          alert('Error submitting registration. Please check your connection and try again.');
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }
});

function showSuccessModal(name, receiptId, year) {
  const modal = document.getElementById('success-modal');
  const receiptElem = document.getElementById('modal-receipt-id');
  const nameElem = document.getElementById('modal-user-name');

  if (modal && receiptElem && nameElem) {
    // Safe textContent assignment prevents XSS
    receiptElem.textContent = receiptId;
    nameElem.textContent = \`\${name} (\${year} Batch)\`;
    modal.classList.add('active');
  }
}
`;

fs.writeFileSync('js/alumni-form.js', hardenedAlumniForm, 'utf8');
console.log('[Fixed] Hardened js/alumni-form.js with input sanitization, phone/email validation, timeout abort controller, and cryptographic receipt ID.');
