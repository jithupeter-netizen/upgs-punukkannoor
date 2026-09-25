# 📋 UPGS Punukkonnoor — Free Form Automation & Cloudflare Turnstile Guide

This guide walks you through deploying the **100% Free** form backend that:
1. Delivers **`contact.html`** inquiries directly to the school Gmail inbox: **`upgspunukkonnoor@gmail.com`**.
2. Saves **`alumni.html`** registrations into a Google Sheet in the school's **Google Drive**.
3. Protects both forms with **Cloudflare Turnstile CAPTCHA** (puzzle-free spam defense).

---

## 🚀 Step 1: Deploy the Google Apps Script (5 Minutes)

1. Sign into the school Google account: **`upgspunukkonnoor@gmail.com`**.
2. Open Google Drive (https://drive.google.com).
3. Click **New** ➔ **More** ➔ **Google Apps Script** (or open https://script.google.com/home/start).
4. Name the project: **`UPGS_Website_Form_Service`**.
5. Delete any existing code in the editor, and paste the entire code from:
   [`scripts/google-apps-script.gs`](google-apps-script.gs)
6. Click **Save** (💾 icon).
7. In the top-right corner, click **Deploy** ➔ **New deployment**:
   - **Select type**: Click the gear icon ⚙️ ➔ Choose **Web app**.
   - **Description**: `Production v1`
   - **Execute as**: `Me (upgspunukkonnoor@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial so the website can send data)*
8. Click **Deploy**.
9. Google will ask you to **Authorize Access**:
   - Click **Authorize access** ➔ Choose the school Google account.
   - Click **Advanced** ➔ Click **Go to UPGS_Website_Form_Service (unsafe)** (standard for self-hosted scripts).
   - Click **Allow**.
10. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 🔗 Step 2: Paste Your Web App URL into Website Scripts

Open both script files and update `GOOGLE_WEBHOOK_URL`:
- In [`js/contact-form.js`](../js/contact-form.js):
  ```javascript
  export const GOOGLE_WEBHOOK_URL = 'PASTE_YOUR_COPIED_URL_HERE';
  ```
- In [`js/alumni-form.js`](../js/alumni-form.js):
  ```javascript
  const GOOGLE_SHEET_WEBHOOK_URL = 'PASTE_YOUR_COPIED_URL_HERE';
  ```

---

## 🛡️ Step 3: Cloudflare Turnstile CAPTCHA Setup (Free)

The website uses Cloudflare Turnstile for spam protection on both `contact.html` and `alumni.html`.

- **Turnstile Site Key**: `0x4AAAAAAFC_ukIYVeqZOtUb`
- **Allowed Hostnames in Cloudflare**:
  - `upgs-punukkannoor.pages.dev`
  - `upgspunukkonnoor.com`
  - `localhost` (allows testing on local development server)
- **Widget Mode**: `Managed`

---

## ☁️ Step 4: Deploying to Cloudflare Pages (Free)

1. In Cloudflare Dashboard, go to **Workers & Pages** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git**.
2. Select your GitHub repository: `jithupeter-netizen/upgs-punukkannoor`.
3. Set Build Settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**. Cloudflare Pages will build and host your site on global edge nodes with instant HTTPS for free!
