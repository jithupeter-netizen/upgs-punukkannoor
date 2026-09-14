# 🏫 UPGS Punukkannoor — 100th Centenary Jubilee Website

[![School](https://img.shields.io/badge/School-UPGS%20Punukkannoor-blue.svg)](https://github.com)
[![Centenary](https://img.shields.io/badge/Jubilee-100%20Years%20(1926--2026)-gold.svg)](https://github.com)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)](https://github.com)

Welcome to the official web application for **Upper Primary Government School (UPGS) Punukkannoor**, located in Kollam District, Kerala, India. 

Designed with a **Minimalist Editorial** aesthetic, this responsive website celebrates **100 Years of Educational Excellence (1926 – 2026)**. It serves as a digital gateway for students, parents, faculty, global alumni, and community members.

---

## ✨ Features & Highlights

### 👓 360° Interactive Virtual Campus Tour
- **Full VR Experience**: Powered by **Pannellum 360**, offering immersive interactive panoramas of key campus locations.
- **Multi-Scene Navigation**: Switch seamlessly between the Main Entrance, Digital Smart Classrooms, Science & Computer Lab, Library, and Playground.
- **Hero 360 Background**: Live panoramic ambient background integrated directly into the home page hero section.

### 🎓 Centenary Alumni Registration Portal
- **Alumni Data Collection**: Active campaign form allowing former students from 1926 to 2026 to register and reconnect.
- **Interactive Directory & Counter**: Displays global alumni distribution and registration statistics.

### 🏛️ Comprehensive School Governance & Academic Info
- **About & History**: Timeline tracing the 100-year legacy of the school.
- **Staff Directory**: Profiles of teaching and non-teaching faculty.
- **PTA & MPTCA**: Dedicated section for Parent-Teacher Association & Mother-PTA leadership.
- **Activities & Clubs**: Information on Little Kites IT Club, Eco Club, Cub & Bulbul, and Sports.

### 🖼️ Photo & Video Gallery
- **Categorized Media Grid**: Filter campus memories by Centenary Events, Digital Classrooms, Cultural & Sports, and Campus Life.
- **Lightbox Viewer**: Modal window for viewing high-resolution imagery.

---

## 📁 Directory Structure

```text
UPGS Punukkannoor/
├── index.html            # Main Landing Page with 360 Hero & Centenary Highlights
├── about.html            # School History (1926-2026), Vision, & Headmasters Timeline
├── staff.html            # Faculty & Staff Directory
├── pta.html              # PTA & MPTCA Executive Committee & Initiatives
├── virtual-tour.html     # Fullscreen 360° Interactive Campus Virtual Tour
├── gallery.html          # Categorized Photo & Video Gallery with Lightbox
├── alumni.html           # Centenary Alumni Data Collection & Registration Portal
├── contact.html          # Contact details, Query Form & Google Map Embed
├── css/
│   ├── main.css          # Core CSS Reset, Variables, Layout & Typography
│   ├── components.css    # UI Components (Cards, Buttons, Modals, Forms)
│   └── virtual-tour.css  # Styles for 360 VR Viewer & Hotspot Tooltips
├── js/
│   ├── main.js           # Global Navigation, Mobile Menu, & UI Interactions
│   ├── 360-viewer.js     # Pannellum Virtual Tour Initializer & Hotspots
│   ├── hero-slider.js    # Centenary Editorial Hero Slider Controller
│   └── alumni-form.js    # Alumni Form Validation & Registration Handling
└── images/               # Logos, School Photos, Badges, & 360° Panoramas
```

---

## 🛠️ Technology Stack

| Category | Technology / Library | Description |
|---|---|---|
| **Frontend Core** | HTML5, CSS3, JavaScript (ES6+) | Vanilla web standards for ultra-fast loading & high performance |
| **Styling Architecture** | CSS Custom Properties (Variables) | Minimalist Editorial Theme with dark mode accents & responsive grid |
| **360° Panoramic VR** | [Pannellum 360](https://pannellum.org/) | Equirectangular VR viewing engine for campus navigation |
| **Iconography** | [FontAwesome 6.4.0](https://fontawesome.com/) | Vector icons for UI elements and navigation |
| **Typography** | Google Fonts | Modern, clean editorial fonts for readability |

---

## 🚀 Getting Started / Local Development

Since this project is built using native web technologies (HTML, CSS, JavaScript), no node dependencies or build steps are required.

### Quick Start:

1. **Clone or Download** the repository:
   ```bash
   git clone https://github.com/your-username/upgs-punukkannoor.git
   ```
2. **Open directly in browser**:
   - Double-click `index.html` or open it with your preferred web browser.

3. **Recommended (Local Web Server)**:
   For 360° panoramic images and cross-origin resource loading, run with a local HTTP server:
   - **VS Code**: Use the *Live Server* extension on `index.html`.
   - **Python 3**:
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000` in your web browser.
   - **NodeJS (`npx`)**:
     ```bash
     npx serve .
     ```

---

## 📞 Contact & School Info

- **School**: Upper Primary Government School (UPGS) Punukkannoor
- **Location**: Punukkannoor, Perumpuzha P.O., Kollam, Kerala - 691504
- **Phone**: +91 474 2501234
- **Email**: upgspunukkannoor@gmail.com
- **Centenary Jubilee Year**: 1926 – 2026

---

© 2026 UPGS Punukkannoor. All Rights Reserved. Celebrating 100 Years of Educational Service.
