# 🚀 MERN Stack Premium Portfolio & CMS

A high-performance, premium, and fully-featured personal portfolio built on the **MERN (MongoDB, Express, React, Node.js) stack**. This application integrates state-of-the-art interactive graphics (GSAP animations, Lenis smooth scrolling, and an interactive HTML5 Canvas particle mesh) with a secure, dashboard-managed Content Management System (CMS) and real-time visitor analytics.

---

## ✨ Features

### 🌟 Public Portfolio
- **Interactive Visuals**: Neural-mesh background particles, GSAP-driven scroll timelines, and a 3D coverflow certificate layout optimized for mobile screens.
- **Scroll Buttons**: Floating controls for smooth, single-click navigation to the top and bottom of the page.
- **Dynamic Content**: Data is served dynamically from MongoDB APIs (Profile data, Highlights, Skills, Projects, Education, Work Experience, Certifications).
- **Interactive Experience Timeline**: Interactive GSAP-animated timeline track tracking scroll progress, featuring structured work experience entries with custom tags.
- **Downloadable Resume & Certificates**: Instantly preview and download resumes and credentials.

### 🔐 Secret Admin CMS (Click-to-Reveal)
- **Zero-Login Gateway**: No public login page exists. To access the admin panel, simply **click the "BG" logo in the header 5 times within 2 seconds**. This triggers a secure routing switch to `/#/admin` using an API token header.
- **Comprehensive CMS Dashboard**:
  - **✍️ Blog Manager**: Full markdown editor with real-time split-screen side-by-side preview to Create, Edit, Delete, and Publish posts.
  - **💼 Experience Manager**: Add and manage professional experience using calendar date pickers, a "Currently Working Here" toggle, and internship/recommendation certificate file uploads (with inline PDF/image preview modals).
  - **📜 Certifications Manager**: Upload certificate images or PDFs, configure custom cover displays, and manage details.
  - **📂 Resume Manager**: Manage resume files, preview current active versions, and track version history.
- **📊 Real-time Visitor Analytics**:
  - Tracks visitor counts, referral sources, popular projects, and browser/device distributions using `ua-parser-js`.
  - Geo-IP lookup (`geoip-lite`) logs visitor country demographics.
  - Data is plotted using interactive **Recharts** graphs.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite SPA, TypeScript, GSAP, Lenis, Recharts, Lucide Icons)
- **Backend**: Node.js, Express, Multer (file uploads), GeoIP-Lite, UA-Parser-JS
- **Database**: MongoDB (configured for MongoDB Atlas replica set)

---

## 📂 Folder Structure
- `/backend`: Node/Express backend APIs, database models, static upload pathways, and DB seed utilities.
- `/frontend`: React SPA client featuring administrative dashboards and modular portfolio section views.
- `/uploads`: Dynamically uploaded media files (resumes, credentials, and experience certificates) served statically.

---

## 🚀 Installation & Setup

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB Atlas** database cluster

### 2. Configure Environment Variables
Create a `.env` file inside the `/backend` directory containing the following:
```env
PORT=5001
MONGO_URI=mongodb://<user>:<password>@<shards>/portfolio?ssl=true&replicaSet=<replicaset>&authSource=admin&retryWrites=true&w=majority
ADMIN_KEY=bg-portfolio-admin-2024-secret
```

### 3. Installation
Install packages for both root, frontend, and backend environments concurrently:
```bash
npm run install-all
```

### 4. Database Seeding
To initialize the database with pre-populated experience, certificates, projects, and education history:
```bash
npm run seed
```

### 5. Running in Development Mode
Start both backend API and frontend Vite servers concurrently:
```bash
npm run dev
```
- Frontend: [http://localhost:5173/](http://localhost:5173/)
- Backend API: [http://localhost:5001/](http://localhost:5001/)

---

## 📦 Production Build
To build the application for deployment:
```bash
npm run build --prefix frontend
```
The optimized production bundle will be generated in `/frontend/dist`.
