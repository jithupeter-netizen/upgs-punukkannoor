/**
 * UPGS Punukkonnoor - Contact Inquiry Form Handler with Cloudflare Turnstile CAPTCHA
 * Sends submissions to School Gmail Inbox (upgspunukkonnoor@gmail.com) via Google Apps Script Webhook
 */

// 👉 School Google Apps Script Web App URL (Unified for Contact Emails & Alumni Sheet):
export const GOOGLE_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzZ7sw_OCbXA5_NS6JhmDoh2IZs0Br8EHVHoKnoveu0tVMaN-vmTclej--00Q2Jd7G16A/exec';

/**
 * Sanitizes input string to prevent XSS and control character injection
 * @param {string} str - Raw user input
 * @param {number} maxLen - Maximum allowable length
 * @returns {string} Sanitized string
 */
function sanitizeInput(str, maxLen = 200) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>\/\\{}]/g, '')
    .trim()
    .slice(0, maxLen);
}

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactInquiryForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Gather & Sanitize Inputs
    const rawName = document.getElementById('contact_name')?.value || '';
    const rawEmail = document.getElementById('contact_email')?.value || '';
    const rawPhone = document.getElementById('contact_phone')?.value || '';
    const rawCategory = document.getElementById('contact_category')?.value || '';
    const rawSubject = document.getElementById('contact_subject')?.value || '';
    const rawMessage = document.getElementById('contact_message')?.value || '';

    const fullName = sanitizeInput(rawName, 100);
    const email = sanitizeInput(rawEmail, 100);
    const phone = sanitizeInput(rawPhone, 20);
    const category = sanitizeInput(rawCategory, 80);
    const subject = sanitizeInput(rawSubject, 150);
    const message = sanitizeInput(rawMessage, 2000);

    // 2. Validate Inputs
    if (!fullName || fullName.length < 2) {
      alert('Please enter your full name.');
      document.getElementById('contact_name')?.focus();
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address so school authorities can reply to you.');
      document.getElementById('contact_email')?.focus();
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      alert('Please enter a valid phone or WhatsApp number (minimum 7 digits).');
      document.getElementById('contact_phone')?.focus();
      return;
    }

    if (!category) {
      alert('Please select an inquiry category.');
      document.getElementById('contact_category')?.focus();
      return;
    }

    if (!subject || subject.length < 3) {
      alert('Please provide a brief subject for your message.');
      document.getElementById('contact_subject')?.focus();
      return;
    }

    if (!message || message.length < 10) {
      alert('Please write your message (at least 10 characters).');
      document.getElementById('contact_message')?.focus();
      return;
    }

    // 3. Validate Cloudflare Turnstile CAPTCHA Token
    const turnstileResponse = contactForm.querySelector('[name="cf-turnstile-response"]')?.value;
    if (!turnstileResponse) {
      alert('Please complete the Cloudflare security verification (I am human) before submitting.');
      return;
    }

    // 4. UI Submit State
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending to School Inbox...</span> <i class="fas fa-spinner fa-spin"></i>';
    }

    const payload = {
      action: 'contact',
      fullName,
      email,
      phone,
      category,
      subject,
      message,
      turnstileToken: turnstileResponse,
      submittedAt: new Date().toISOString()
    };

    try {
      if (GOOGLE_WEBHOOK_URL && GOOGLE_WEBHOOK_URL.startsWith('http')) {
        // Send request with 12s timeout controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        await fetch(GOOGLE_WEBHOOK_URL, {
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
      showContactSuccessModal(fullName, email, subject);
      contactForm.reset();

      // Reset Turnstile widget for fresh state
      if (typeof window.turnstile !== 'undefined') {
        window.turnstile.reset();
      }

    } catch (err) {
      console.error('Contact form submission error:', err);
      if (err.name === 'AbortError') {
        alert('Network request timed out. Please check your internet connection and try again.');
      } else {
        alert('Error sending message. Please try again or reach out directly at +91 9447135592.');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    }
  });
});

/**
 * Displays the Contact Success Modal
 */
function showContactSuccessModal(name, email, subject) {
  let modal = document.getElementById('contact-success-modal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'contact-success-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-icon-badge" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
          <i class="fas fa-paper-plane" style="color: #ffffff;"></i>
        </div>
        <h2 style="color: var(--primary-navy); font-size: 1.85rem; font-weight: 800; margin-bottom: 0.5rem;">Message Delivered!</h2>
        <p style="color: #64748b; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.25rem;">
          Thank you, <strong id="contact-modal-user-name" style="color: var(--primary-navy);"></strong>! Your message has been sent directly to the UPGS School Gmail inbox.
        </p>
        
        <div class="modal-receipt-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; text-align: left;">
          <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 0.35rem;">
            <strong>Subject:</strong> <span id="contact-modal-subject" style="color: #0f172a;"></span>
          </div>
          <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 0.35rem;">
            <strong>Recipient:</strong> <span style="color: #0369a1; font-weight: 700;">upgspunukkonnoor@gmail.com</span>
          </div>
          <div style="font-size: 0.82rem; color: #64748b;">
            <strong>Confirmation sent to:</strong> <span id="contact-modal-email" style="color: #0f172a;"></span>
          </div>
        </div>

        <button class="form-stylish-btn" id="contactModalCloseBtn" style="width: 100%; padding: 0.9rem;">
          Done
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#contactModalCloseBtn')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  const nameElem = modal.querySelector('#contact-modal-user-name');
  const emailElem = modal.querySelector('#contact-modal-email');
  const subjectElem = modal.querySelector('#contact-modal-subject');

  if (nameElem) nameElem.textContent = name;
  if (emailElem) emailElem.textContent = email;
  if (subjectElem) subjectElem.textContent = subject;

  modal.classList.add('active');
}
