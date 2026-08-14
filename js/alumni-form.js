/* UPGS Punukkannoor - Alumni Data Collection Form Handler */

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

      // Simple Validation
      if (!fullName || !passingYear || !phoneNumber) {
        alert('Please fill in all required fields (Full Name, Batch Year, and Phone Number).');
        return;
      }

      const submitBtn = alumniForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting... / നൽകുന്നു...';

      // Generate Receipt ID for Phase 1 Mock Registration
      const receiptId = 'UPGS100-ALM-' + Math.floor(1000 + Math.random() * 9000);

      try {
        /* 
           PHASE 2 Integration:
           const response = await fetch('https://api.upgspunukkannoor.org/api/v1/alumni/register', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ fullName, passingYear, phoneNumber, email, location, occupation, memories })
           });
        */
        
        // Simulate API network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Show Success Modal
        showSuccessModal(fullName, receiptId, passingYear);
        alumniForm.reset();

      } catch (err) {
        alert('Error submitting registration. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
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

function closeModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}
