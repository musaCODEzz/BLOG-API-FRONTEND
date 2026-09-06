# StackPulse — Frontend Client

A modern, fast, and responsive developer publication client built with **React**, **TypeScript**, and **Vite**, connecting directly to our live Express & MongoDB REST API.

> *Modern ideas, architecture & developer stories.*

---

## 🔗 Live Backend API
- **Base URL**: [`https://blog-api-backend-mh0s.onrender.com`](https://blog-api-backend-mh0s.onrender.com)
- **API Documentation**: [`https://blog-api-backend-mh0s.onrender.com/api-docs`](https://blog-api-backend-mh0s.onrender.com/api-docs)
- **Primary Endpoint**: `/api/blogs`

---

## 🛠️ Tech Stack
- **Library**: React 19
- **Language**: TypeScript
- **Tooling**: Vite (Hot Module Replacement)
- **Styling**: Modern CSS (Vanilla CSS & CSS Variables)
- **Networking**: Browser Fetch API

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173` to see the live app.

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Project Directory Structure

```text
blog-api-frontend/
├── index.html         # HTML entry shell containing <div id="root">
├── package.json       # Dependencies and npm scripts
├── tsconfig.json      # TypeScript compiler rules
├── vite.config.ts     # Vite configuration
├── PRD.md             # Product Requirements Document
├── README.md          # Project guide and overview
├── public/            # Static assets (favicons, etc.)
└── src/
    ├── main.tsx       # JavaScript entry point (mounts React into index.html)
    ├── App.tsx        # Root component
    ├── App.css        # Component-level styles
    ├── index.css      # Global base styles and design variables
    └── assets/        # Visual assets and icons
```

---

## 🗺️ Learning Roadmap
- [x] **Phase 1**: Project Setup, Git Initialization & Skeleton Inspection
- [x] **Phase 2**: Connecting to Live API & Fetching Posts
- [x] **Phase 3**: Component Architecture & Feed UI
- [x] **Phase 4**: Multi-Page Routing & Post Detail View
- [x] **Phase 5**: Authentication, Post Creation & Comments
