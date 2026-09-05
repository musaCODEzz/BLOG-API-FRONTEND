# Product Requirements Document (PRD)

## Project: Blog API Frontend (`blog-api-frontend`)
- **Type**: Single Page Web Application (SPA)
- **Framework**: React 19 + TypeScript + Vite
- **Target Backend**: [Live Express & MongoDB API on Render](https://blog-api-backend-mh0s.onrender.com)
- **Primary Objective**: Build a modern, responsive, developer-friendly web client to consume the existing blog backend, structured step-by-step for deep conceptual learning.

---

## 1. Executive Summary & Architecture

This frontend serves as the visual interface for our existing REST API. It decouples presentation from data persistence, communicating exclusively via HTTPS JSON requests.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│  React (Components, State, Router) + TypeScript             │
└──────────────┬──────────────────────────────▲───────────────┘
               │ HTTP POST / PUT / DELETE      │ HTTP 200 OK (JSON)
               │ (with Bearer JWT Token)       │
               ▼                              │
┌─────────────────────────────────────────────┴───────────────┐
│              Live Backend API (Render)                      │
│     https://blog-api-backend-mh0s.onrender.com              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Target Backend Endpoints

Our frontend will communicate with the following live routes:

| Method | Endpoint | Description | Auth Required? |
| :--- | :--- | :--- | :--- |
| `GET` | `/blogs` | Fetch paginated list of blog posts | No |
| `GET` | `/blogs/:id` | Fetch single blog post by MongoDB ID | No |
| `POST` | `/blogs` | Create a new blog post (`title`, `content`) | **Yes (Bearer JWT)** |
| `PUT` | `/blogs/:id` | Update an existing blog post | **Yes (Author only)** |
| `DELETE` | `/blogs/:id` | Remove a blog post | **Yes (Author only)** |
| `GET` | `/blogs/:id/comments` | Fetch all comments on a post | No |
| `POST` | `/blogs/:id/comments` | Add a comment to a post | **Yes (Bearer JWT)** |
| `POST` | `/users/register` | Register new account (`username`, `email`, `password`) | No |
| `POST` | `/users/login` | Log in and receive JWT token + user profile | No |

---

## 3. Core Features & Functional Requirements

### 3.1 Post Feed & Discovery (Phase 2 & 3)
- **Post Cards**: Display post title, content excerpt, author name, and formatted creation date.
- **Loading State**: Display a clean loading indicator while network requests are in flight (important for Render free-tier cold starts).
- **Error Handling**: Friendly error messages with retry options if the server cannot be reached.

### 3.2 Reading & Discussion (Phase 4)
- **Detail View**: Dedicated page for reading a single post with full typography and styling.
- **Comment Feed**: Display community comments associated with the post.
- **Comment Input**: Authenticated form allowing users to submit new comments instantly.

### 3.3 Authentication & Session (Phase 5)
- **Registration**: Form with client-side validation (email format, password length).
- **Login**: Authenticates against backend, stores JWT in browser `localStorage`.
- **Global Auth State**: Top navigation updates dynamically (shows user profile & "New Post" button when logged in, "Login" button when logged out).
- **Logout**: Clears stored token and resets app state.

### 3.4 Post Creation & Publishing (Phase 5)
- **Authoring Interface**: Clean title and markdown/content input fields.
- **Authorization Guard**: Unauthenticated users are prompted to log in before publishing.
- **Success Redirect**: Automatically navigates to the newly created post upon publishing.

---

## 4. Technical Specifications

- **Build Tool**: Vite (blazing fast development server & ES module bundler)
- **Language**: TypeScript (strict type checking matching backend Mongoose schemas)
- **UI Architecture**: React Component Hierarchy:
  - Atomic UI blocks: Buttons, Inputs, Cards, Badges
  - Layout: Navigation bar, main content area, footer
  - Views: Feed view, Detail view, Login/Register view, Create Post view
- **State Management**: React Native Hooks (`useState`, `useEffect`, `useContext`)
- **HTTP Client**: Native `fetch` with a lightweight, reusable API service layer.

---

## 5. Development Phases & Git Milestones

Each phase corresponds to a clean Git commit milestone:

1. **Phase 1: Project Skeleton & Tooling Setup** (Current)
   - Initialize Vite, TypeScript, Git repository, PRD, and clean README.
2. **Phase 2: Connecting to Live API & Data Fetching**
   - Configure API service and fetch live posts from Render.
3. **Phase 3: Component Design & Feed UI**
   - Create reusable `<BlogCard />` components and responsive feed grid.
4. **Phase 4: Client-Side Routing & Post Details**
   - Page navigation and single-post reading view with comments.
5. **Phase 5: Authentication, Post Creation & Polish**
   - Login, registration, token persistence, and post authoring.
