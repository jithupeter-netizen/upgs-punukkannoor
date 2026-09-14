/* UPGS Punukkannoor - Alumni Data Collection Form Handler with Google Sheets Webhook */

// 👉 Put your Google Apps Script Web App URL here:
const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzPWgW7k2rj8zDVscQb9IdMK-3etUZ8LIbt3JGBVgsi0CocTAWSzPtjwJ7YmdhbQnw/exec';

document.addEventListener('DOMContentLoaded', () => {
  const alumniForm = document.getElementById('alumni-registration-form');
  const passingYearSelect = document.getElementById('passing_year');

  // 1. Populate Batch Years (1926 to 2026)
  if (passingYearSelect) {
    const startYear = 1926;
    const endYear = 2026;
    
    for (let year = endYear; year >= startYear; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = `${year} Batch`;
      passingYearSelect.appendChild(option);
    }
  }

  // 2. Form Submission Handler
  if (alumniForm) {
    alumniForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('full_name').value.trim();
      const passingYear = document.getElementById('passing_year').value;
      const phoneNumber = document.getElementById('phone_number').value.trim();
      const email = document.getElementById('email').value.trim();
      const location = document.getElementById('location').value.trim();
      const occupation = document.getElementById('occupation').value.trim();
      const memories = document.getElementById('memories').value.trim();

      // Validation
      if (!fullName || !passingYear || !phoneNumber) {
        alert('Please fill in all required fields (Full Name, Batch Year, and WhatsApp Number).');
        return;
      }

      const submitBtn = alumniForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Submitting Registration...</span> <i class="fas fa-spinner fa-spin"></i>';

      // Generate Receipt ID
      const receiptId = 'UPGS100-ALM-' + Math.floor(1000 + Math.random() * 9000);

      const payload = {
        receiptId,
        fullName,
        passingYear,
        phoneNumber,
        email,
        location,
        occupation,
        memories
      };

      try {
        if (GOOGLE_SHEET_WEBHOOK_URL && GOOGLE_SHEET_WEBHOOK_URL.startsWith('http')) {
          // Send directly to Google Sheets Webhook
          await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } else {
          // Fallback simulation if webhook URL is not yet configured
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Show Success Modal
        showSuccessModal(fullName, receiptId, passingYear);
        alumniForm.reset();

      } catch (err) {
        console.error('Submission error:', err);
        alert('Error submitting registration. Please check your internet connection and try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }
});

function showSuccessModal(name, receiptId, year) {
  const modal = document.getElementById('success-modal');
  const receiptElem = document.getElementById('modal-receipt-id');
  const nameElem = document.getElementById('modal-user-name');

  if (modal && receiptElem && nameElem) {
    receiptElem.textContent = receiptId;
    nameElem.textContent = `${name} (${year} Batch)`;
    modal.classList.add('active');
  }
}

window.closeModal = function() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.remove('active');
  }
};
