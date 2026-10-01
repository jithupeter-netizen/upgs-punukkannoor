/**
 * ============================================================================
 * UPGS Punukkonnoor — 100th Centenary Jubilee (1926 - 2026)
 * Unified Google Apps Script Backend (Web App & Headless CMS)
 * 
 * Features:
 * 1. doGet(e): Live Google Drive Gallery API + Subfolder Categories
 * 2. doPost(e): Form Submissions (Contact Email + Alumni Directory Google Sheet)
 * 3. testScanGallery(): Built-in tester to verify Drive folder in Execution Log
 * 
 * Free • Hosted in School Google Account
 * ============================================================================
 */

// School Configuration
const SCHOOL_CONFIG = {
  NOTIFICATION_EMAIL: "upgspunukkonnoor@gmail.com",
  SCHOOL_NAME: "UPGS Punukkonnoor",
  ALUMNI_SHEET_NAME: "UPGS_Centenary_Alumni_Directory",
  
  // 👉 Target Gallery Google Drive Folder ID (inside gallery/pics):
  GALLERY_FOLDER_ID: "1KPmJMR-dLNFNv80TxEWNg7t3ASeyCWL9",

  // 👉 Optional Master Spreadsheet ID for dynamic settings/announcements:
  WEBLINKS_SPREADSHEET_ID: "17zAd71MkOwgoReEvjYQtsFMEHiJ6T-fQOHPqPXOqMII"
};

/**
 * ============================================================================
 * HTTP GET Handler — Delivers Gallery & CMS Content
 * ============================================================================
 */
function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const type = (params.type || "all").toLowerCase();
    const noCache = params.nocache === "1" || params.refresh === "1";

    const cache = CacheService.getScriptCache();
    const cacheKey = "upgs_cms_" + type;

    if (!noCache && cache) {
      const cached = cache.get(cacheKey);
      if (cached) {
        return createJsonResponse(JSON.parse(cached));
      }
    }

    let responseData = {};

    // 1. Scan Google Drive Gallery Photos & Subfolder Categories
    if (type === "gallery" || type === "all") {
      responseData.gallery = getDriveGallery();
    }

    // 2. Settings (Marquee announcement, leadership messages)
    if (type === "settings" || type === "all") {
      responseData.settings = getSheetSettings();
    }

    // 3. YouTube Videos
    if (type === "videos" || type === "all") {
      responseData.videos = getSheetVideos();
    }

    // 4. Testimonials
    if (type === "testimonials" || type === "all") {
      responseData.testimonials = getSheetTestimonials();
    }

    const payload = {
      status: "success",
      school: SCHOOL_CONFIG.SCHOOL_NAME,
      folderId: SCHOOL_CONFIG.GALLERY_FOLDER_ID,
      count: responseData.gallery ? responseData.gallery.length : 0,
      timestamp: new Date().toISOString(),
      data: responseData
    };

    // Cache response for 5 minutes (300 seconds) for fast page loads
    try {
      if (cache) cache.put(cacheKey, JSON.stringify(payload), 300);
    } catch (cacheErr) {}

    return createJsonResponse(payload);

  } catch (err) {
    return createJsonResponse({
      status: "error",
      error: err.toString(),
      message: "Failed to fetch content from Google Drive"
    });
  }
}

/**
 * Scans Google Drive Gallery Folder for Images & Subfolder Categories
 */
function getDriveGallery() {
  const gallery = [];
  try {
    const rootFolder = DriveApp.getFolderById(SCHOOL_CONFIG.GALLERY_FOLDER_ID);
    scanFolderRecursively(rootFolder, "General", gallery, 0);
  } catch (e) {
    Logger.log("Gallery scan error: " + e.toString());
  }
  return gallery;
}

/**
 * Recursive folder scanner:
 * - Direct photos in root get category "General" (or folder name)
 * - Subfolders (e.g., "Centenary", "Arts", "Sports", "Campus") become category tabs
 */
function scanFolderRecursively(folder, currentCategory, galleryArray, depth) {
  if (depth > 5) return; // Prevent infinite loops

  try {
    // 1. Scan all images inside current folder
    const files = folder.getFiles();
    while (files.hasNext()) {
      const file = files.next();
      const mime = file.getMimeType() || "";
      const rawName = file.getName();
      const isImage = (mime.indexOf("image/") !== -1) || /\.(jpe?g|png|webp|gif|bmp|heic|jfif)$/i.test(rawName);

      if (isImage) {
        const id = file.getId();
        const cleanTitle = rawName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

        galleryArray.push({
          id: id,
          title: cleanTitle,
          category: currentCategory,
          thumbnailUrl: "https://lh3.googleusercontent.com/d/" + id + "=s600",
          fullUrl: "https://lh3.googleusercontent.com/d/" + id + "=s1600",
          date: file.getDateCreated ? file.getDateCreated().toISOString() : ""
        });
      }
    }

    // 2. Walk through each subfolder
    const subfolders = folder.getFolders();
    while (subfolders.hasNext()) {
      const subfolder = subfolders.next();
      const subName = subfolder.getName().trim();

      // If subfolder is a generic container like "Pics" or "Gallery", inherit parent category, else use folder name as Category!
      const isGenericContainer = /^(gallery|galery|pics|pictures|photo|photos|web-admin)$/i.test(subName);
      const nextCategory = (isGenericContainer && currentCategory !== "General") ? currentCategory : subName;

      scanFolderRecursively(subfolder, nextCategory, galleryArray, depth + 1);
    }
  } catch (err) {
    Logger.log("Error scanning folder: " + err.toString());
  }
}

/**
 * Safe Readers for Optional Spreadsheets
 */
function getSheetSettings() {
  try {
    const ss = SpreadsheetApp.openById(SCHOOL_CONFIG.WEBLINKS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Settings") || ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    const settings = {};
    for (let i = 1; i < data.length; i++) {
      const key = String(data[i][0] || "").trim();
      const value = String(data[i][1] || "").trim();
      if (key) settings[key] = value;
    }
    return settings;
  } catch (e) {
    return {};
  }
}

function getSheetVideos() {
  try {
    const ss = SpreadsheetApp.openById(SCHOOL_CONFIG.WEBLINKS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Videos");
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    const videos = [];
    for (let i = 1; i < data.length; i++) {
      const title = String(data[i][0] || "").trim();
      const url = String(data[i][1] || "").trim();
      const cat = String(data[i][2] || "School Life").trim();
      if (title && url) {
        const vId = extractYouTubeId(url);
        videos.push({
          title: title,
          videoId: vId,
          url: url,
          thumbnail: vId ? "https://img.youtube.com/vi/" + vId + "/hqdefault.jpg" : "",
          category: cat
        });
      }
    }
    return videos;
  } catch (e) {
    return [];
  }
}

function getSheetTestimonials() {
  try {
    const ss = SpreadsheetApp.openById(SCHOOL_CONFIG.WEBLINKS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Testimonials");
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    const testimonials = [];
    for (let i = 1; i < data.length; i++) {
      const name = String(data[i][0] || "").trim();
      const role = String(data[i][1] || "").trim();
      const msg = String(data[i][2] || "").trim();
      if (name && msg) {
        testimonials.push({ name: name, role: role, message: msg });
      }
    }
    return testimonials;
  } catch (e) {
    return [];
  }
}

function extractYouTubeId(url) {
  if (!url) return "";
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
  return (match && match[2].length === 11) ? match[2] : "";
}

/**
 * ============================================================================
 * HTTP POST Handler — Form Submissions (Contact + Alumni)
 * ============================================================================
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
 * Contact Form -> School Email
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #0a192f 0%, #0f172a 100%); color: #ffffff; padding: 24px; text-align: center; border-bottom: 4px solid #f59e0b;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 800;">UPGS Punukkonnoor</h2>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #fbbf24;">100 Years of Excellence • Contact Inquiry</p>
      </div>
      <div style="padding: 24px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 10px; background: #f8fafc; font-weight: bold; width: 35%; border: 1px solid #e2e8f0;">Full Name:</td><td style="padding: 10px; border: 1px solid #e2e8f0;">${name}</td></tr>
          <tr><td style="padding: 10px; background: #f8fafc; font-weight: bold; border: 1px solid #e2e8f0;">Email:</td><td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 10px; background: #f8fafc; font-weight: bold; border: 1px solid #e2e8f0;">Phone:</td><td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="tel:${phone}">${phone}</a></td></tr>
          <tr><td style="padding: 10px; background: #f8fafc; font-weight: bold; border: 1px solid #e2e8f0;">Category:</td><td style="padding: 10px; border: 1px solid #e2e8f0;">${category}</td></tr>
          <tr><td style="padding: 10px; background: #f8fafc; font-weight: bold; border: 1px solid #e2e8f0;">Subject:</td><td style="padding: 10px; border: 1px solid #e2e8f0;">${subject}</td></tr>
        </table>
        <div style="background: #f1f5f9; border-left: 4px solid #0284c7; padding: 14px 16px; border-radius: 4px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="font-size: 12px; color: #94a3b8; text-align: right; margin: 0;">Received on: ${time}</p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: SCHOOL_CONFIG.NOTIFICATION_EMAIL,
    replyTo: (email && email.includes("@")) ? email : undefined,
    subject: emailSubject,
    htmlBody: htmlBody
  });

  return createJsonResponse({ status: "success", message: "Message sent successfully!" });
}

/**
 * Alumni Form -> Google Sheet
 */
function handleAlumniForm(data) {
  let spreadsheet;
  const files = DriveApp.getFilesByName(SCHOOL_CONFIG.ALUMNI_SHEET_NAME);
  if (files.hasNext()) {
    spreadsheet = SpreadsheetApp.open(files.next());
  } else {
    spreadsheet = SpreadsheetApp.create(SCHOOL_CONFIG.ALUMNI_SHEET_NAME);
    const initSheet = spreadsheet.getActiveSheet();
    initSheet.setName("Registrations");
    initSheet.appendRow(["Timestamp", "Receipt ID", "Full Name", "Phone", "Email", "Batch / Passing Year", "Profession", "Location", "Contribution", "Memories"]);
    initSheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#0a192f").setFontColor("#ffffff");
  }

  const sheet = spreadsheet.getSheetByName("Registrations") || spreadsheet.getSheets()[0];
  const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const receiptId = data.receiptId || ("UPGS100-ALM-" + Math.floor(1000 + Math.random() * 9000));

  sheet.appendRow([
    time,
    receiptId,
    data.fullName || data.name || "",
    data.phone || data.phoneNumber || "",
    data.email || "",
    data.batchYear || data.passoutYear || data.batch || "",
    data.profession || data.occupation || "",
    data.location || data.city || "",
    data.contribution || data.support || "",
    data.message || data.memories || ""
  ]);

  return createJsonResponse({ status: "success", receiptId: receiptId, message: "Alumni registration successful!" });
}

/**
 * Built-in Test Function:
 * Run this directly from the Google Apps Script toolbar to test what Drive sees!
 */
function testScanGallery() {
  const root = DriveApp.getFolderById(SCHOOL_CONFIG.GALLERY_FOLDER_ID);
  Logger.log("📁 Scanning Root Folder: " + root.getName() + " (" + root.getId() + ")");
  const photos = getDriveGallery();
  Logger.log("📸 TOTAL PHOTOS DETECTED: " + photos.length);
  for (let i = 0; i < photos.length; i++) {
    Logger.log((i + 1) + ". [" + photos[i].category + "] " + photos[i].title + " -> " + photos[i].thumbnailUrl);
  }
}

/**
 * CORS JSON Helper
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
