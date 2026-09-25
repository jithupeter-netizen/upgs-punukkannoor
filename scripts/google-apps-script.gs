/**
 * ============================================================================
 * UPGS Punukkonnoor — 100th Centenary Jubilee (1926 - 2026)
 * Unified Google Apps Script Backend (Web App)
 * 
 * Functions:
 * 1. Contact Form: Delivers inquiries directly to school Gmail (upgspunukkonnoor@gmail.com)
 * 2. Alumni Form: Appends registrations to Google Sheets in Google Drive
 * 
 * Free • Unlimited • Hosted in School Google Account
 * ============================================================================
 */

// School Configuration
const SCHOOL_CONFIG = {
  NOTIFICATION_EMAIL: "upgspunukkonnoor@gmail.com",
  SCHOOL_NAME: "UPGS Punukkonnoor",
  ALUMNI_SHEET_NAME: "UPGS_Centenary_Alumni_Directory"
};

/**
 * HTTP POST Handler — Receives form submissions from the website
 */
function doPost(e) {
  try {
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("No data received");
    }

    const action = data.action || (data.receiptId ? "alumni" : "contact");

    if (action === "contact") {
      return handleContactForm(data);
    } else if (action === "alumni") {
      return handleAlumniForm(data);
    } else {
      return createJsonResponse({ status: "error", message: "Unknown action: " + action });
    }

  } catch (err) {
    return createJsonResponse({ status: "error", error: err.toString() });
  }
}

/**
 * Handles Contact Form Submissions -> Delivers to School Gmail Inbox
 */
function handleContactForm(data) {
  const name = data.fullName || "Website Visitor";
  const email = data.email || "No email provided";
  const phone = data.phoneNumber || data.phone || "N/A";
  const category = data.category || "General Inquiry";
  const subject = data.subject || "Website Contact Form Submission";
  const message = data.message || "No message content.";
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const emailSubject = "📬 [" + category + "] " + subject + " — from " + name;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0a192f 0%, #0f172a 100%); color: #ffffff; padding: 24px; text-align: center; border-bottom: 4px solid #f59e0b;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">UPGS Punukkonnoor</h2>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #fbbf24; text-transform: uppercase; letter-spacing: 1px;">100 Years of Excellence • Contact Inquiry</p>
      </div>

      <!-- Body Content -->
      <div style="padding: 24px; background: #ffffff;">
        <p style="font-size: 15px; color: #334155; margin-top: 0;">You have received a new inquiry from the school website contact form:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; width: 130px; font-weight: bold;">Sender Name:</td>
            <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Email:</td>
            <td style="padding: 10px 0; color: #0284c7;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Phone / WhatsApp:</td>
            <td style="padding: 10px 0; color: #0f172a;">${phone}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Inquiry Category:</td>
            <td style="padding: 10px 0; color: #b45309; font-weight: 700;">${category}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Subject:</td>
            <td style="padding: 10px 0; color: #0f172a;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-weight: bold;">Date & Time:</td>
            <td style="padding: 10px 0; color: #64748b;">${time} IST</td>
          </tr>
        </table>

        <!-- Message Box -->
        <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px;">Message:</h4>
          <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-line; font-size: 14px;">${message}</p>
        </div>

        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 0;">
          💡 <strong>Tip:</strong> Simply click "Reply" in your email client to respond directly to <strong>${name}</strong> at <strong>${email}</strong>.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
        UPGS Punukkonnoor • Centenary Website Webhook Service
      </div>
    </div>
  `;

  // Deliver directly into school Gmail inbox
  GmailApp.sendEmail(SCHOOL_CONFIG.NOTIFICATION_EMAIL, emailSubject, message, {
    htmlBody: htmlBody,
    replyTo: email,
    name: "UPGS Website Inquiries"
  });

  return createJsonResponse({
    status: "success",
    message: "Contact inquiry successfully delivered to school inbox."
  });
}

/**
 * Handles Alumni Form Submissions -> Records in Google Sheets in Google Drive
 */
function handleAlumniForm(data) {
  const receiptId = data.receiptId || ("UPGS100-ALM-" + Math.floor(1000 + Math.random() * 9000));
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const name = data.fullName || "";
  const year = data.passingYear || "";
  const phone = data.phoneNumber || data.phone || "";
  const email = data.email || "";
  const location = data.location || "";
  const occupation = data.occupation || "";
  const memories = data.memories || "";

  // 1. Locate or Create the Google Sheet in Drive
  let sheet = getOrCreateAlumniSheet();

  // 2. Append Alumni Record
  sheet.appendRow([
    receiptId,
    time,
    name,
    year,
    "'" + phone, // Prefix with apostrophe to preserve formatting in Excel/Sheets
    email,
    location,
    occupation,
    memories
  ]);

  return createJsonResponse({
    status: "success",
    message: "Alumni registration recorded successfully in Google Drive.",
    receiptId: receiptId
  });
}

/**
 * Retrieves the Alumni Spreadsheet from Google Drive or creates it if not existing
 */
function getOrCreateAlumniSheet() {
  const files = DriveApp.getFilesByName(SCHOOL_CONFIG.ALUMNI_SHEET_NAME);
  let spreadsheet;

  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    // Create new spreadsheet in Google Drive
    spreadsheet = SpreadsheetApp.create(SCHOOL_CONFIG.ALUMNI_SHEET_NAME);
    const sheet = spreadsheet.getActiveSheet();
    sheet.setName("Alumni Registrations");

    // Headers
    const headers = [
      "Receipt ID",
      "Registration Date & Time",
      "Full Name",
      "Passing Batch Year",
      "WhatsApp / Phone",
      "Email Address",
      "Current Location",
      "Occupation / Designation",
      "School Memories & Wishes"
    ];

    sheet.appendRow(headers);

    // Style Header Row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0a192f");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setFontSize(11);
    sheet.setFrozenRows(1);

    // Auto-fit column widths
    for (let col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
    }
  }

  return spreadsheet.getActiveSheet();
}

/**
 * Helper to return standard JSON Output with CORS headers
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * HTTP GET Handler (For testing connection in browser)
 */
function doGet(e) {
  return createJsonResponse({
    status: "active",
    school: SCHOOL_CONFIG.SCHOOL_NAME,
    targetEmail: SCHOOL_CONFIG.NOTIFICATION_EMAIL,
    message: "UPGS Punukkonnoor Form Service is running online."
  });
}
