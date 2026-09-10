# StackPulse — Frontend Client

A modern, fast, and premium developer publication platform built with **React 19**, **TypeScript**, and **Vite**. Features a dark-themed glassmorphic UI with interactive engagement tools — likes, bookmarks, tags, comments, reading metrics, and full user profiles.

> *Modern ideas, architecture & developer stories.*

---

## 🔗 Live Links

| Resource | URL |
|----------|-----|
| **Live Frontend** | [Deployed on Vercel / Localhost](http://localhost:5173) |
| **Live Backend API** | [`https://blog-api-backend-mh0s.onrender.com`](https://blog-api-backend-mh0s.onrender.com) |
| **API Documentation** | [`/api-docs`](https://blog-api-backend-mh0s.onrender.com/api-docs) |
| **Backend Repo** | [musaCODEzz/BLOG-API-BACKEND](https://github.com/musaCODEzz/BLOG-API-BACKEND) |

---

## ✨ Features

### 📄 Blog Feed & Content
- **Paginated article feed** with smooth page navigation
- **Sort by**: Latest, Most Popular (likes), Most Viewed
- **Tag-based filtering** — click any tag to filter the feed
- **Popular tags sidebar** with post counts
- **Responsive blog cards** with excerpt previews

### 💖 Likes & Claps System
- **Toggle like/unlike** on any blog post (authenticated)
- **Real-time like count** updates with optimistic UI
- **Heart indicator** on blog cards for liked posts
- **Sort by popularity** (`-likesCount`) for trending content

### 🏷️ Tags & Categories
- **Tag pills** displayed on blog cards and post detail pages
- **Clickable tags** filter the feed instantly
- **Tags sidebar** on the feed page with post counts
- **Smart tag normalization** — lowercased, trimmed, deduplicated
- **Tag input** on create/edit post forms (comma-separated)

### 💬 Comments (Full CRUD)
- **Add comments** on any blog post (authenticated)
- **Inline edit** your own comments with save/cancel actions
- **Delete comments** with confirmation prompt
- **Real-time comment count** and author attribution

### 🔖 Bookmarks & Saved Reading List
- **Bookmark/unbookmark** any story with optimistic toggle
- **Saved Articles page** (`/bookmarks`) with paginated reading list
- **Bookmark icon** on every blog card and post detail page
- **Auth prompt** tooltip for unauthenticated users
- **Instant removal** — unbookmarking from the saved list removes it live

### 👤 User Profile Editing
- **Profile page** (`/profile`) with editable fields:
  - Display Name, Author Bio (300 char max with counter)
  - Avatar Image URL with live preview
  - Social links: Website, GitHub, Twitter/X
- **Password change** with current password verification
- **Author bio card** displayed on post detail pages
- **Avatar display** in navigation header and blog cards

### ⏱️ Reading Time & Views Counter
- **Estimated reading time** auto-computed on each article
- **View counter** increments on post reads
- **Metrics displayed** on blog cards (clock icon + eye icon)
- **Sort by views** (`-views`) for most-read content

### 🔐 Authentication
- **Email/password** registration and login
- **Google OAuth** one-click sign-in (Google Identity Services)
- **Forgot/Reset password** flow with email tokens
- **Author-gated actions** — only post/comment owners see edit/delete controls
- **JWT-based sessions** stored in localStorage

### 📝 Blog Management
- **Create** new posts with rich content and tags
- **Edit** your own posts (title, content, tags)
- **Delete** your own posts with confirmation
- **Author chip** with avatar on all blog cards

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Library** | React 19 |
| **Language** | TypeScript (strict mode) |
| **Build Tool** | Vite 8 (HMR + production builds) |
| **Routing** | React Router v7 |
| **Styling** | Vanilla CSS with CSS custom properties (dark theme) |
| **HTTP** | Browser Fetch API |
| **Auth** | JWT + Google Identity Services |
| **Linting** | OxLint (zero warnings policy) |
| **Backend** | Node.js + Express + MongoDB (REST API) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### 1. Clone the Repository
```bash
git clone https://github.com/musaCODEzz/BLOG-API-FRONTEND.git
cd BLOG-API-FRONTEND
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_API_URL=https://blog-api-backend-mh0s.onrender.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 4. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173` to see the live app.

### 5. Build for Production
```bash
npm run build
```

### 6. Lint Check
```bash
npx oxlint
```

---

## 📁 Project Structure

```text
blog-api-frontend/
├── index.html                  # HTML entry shell
├── package.json                # Dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler rules
├── vite.config.ts              # Vite configuration
├── .env                        # Environment variables (not committed)
├── public/                     # Static assets
└── src/
    ├── main.tsx                # Entry point — mounts React
    ├── App.tsx                 # Root component with routes & navigation
    ├── App.css                 # Component-level styles
    ├── index.css               # Global styles, design tokens & dark theme
    ├── assets/                 # Icons and visual assets
    ├── types/
    │   └── blog.ts             # TypeScript interfaces (BlogPost, User, Comment, etc.)
    ├── context/
    │   └── AuthContext.tsx      # Authentication state & JWT management
    ├── services/
    │   └── api.ts              # Centralized API service (20 endpoints)
    ├── components/
    │   ├── BlogCard.tsx        # Article card with metrics, tags, likes, bookmarks
    │   ├── BookmarkButton.tsx  # Optimistic bookmark toggle with auth prompt
    │   └── PasswordInput.tsx   # Show/hide password input component
    └── pages/
        ├── FeedPage.tsx        # Homepage feed with tags sidebar & sorting
        ├── PostDetailPage.tsx  # Full article view with engagement bar & comments
        ├── CreatePostPage.tsx  # New article form with tag input
        ├── EditPostPage.tsx    # Edit existing article
        ├── LoginPage.tsx       # Email/password & Google OAuth login
        ├── RegisterPage.tsx    # User registration
        ├── ForgotPasswordPage.tsx  # Request password reset
        ├── ResetPasswordPage.tsx   # Reset password with token
        ├── ProfilePage.tsx     # Edit user profile, bio, avatar & socials
        └── SavedArticlesPage.tsx   # Bookmarked articles reading list
```

---

## 🗺️ Routes

| Path | Page | Auth |
|------|------|------|
| `/` | Feed (Homepage) | No |
| `/blogs/:id` | Post Detail | No |
| `/login` | Sign In | No |
| `/register` | Register | No |
| `/create` | Write Story | ✅ |
| `/edit/:id` | Edit Story | ✅ (Author) |
| `/forgot-password` | Forgot Password | No |
| `/reset-password` | Reset Password | No |
| `/profile` | Edit Profile | ✅ |
| `/bookmarks` | Saved Reading List | ✅ |

---

## 🔌 API Endpoints Used

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/api/blogs` | Fetch paginated blogs (supports `sort`, `tag` params) |
| 2 | GET | `/api/blogs/:id` | Fetch single blog post (increments views) |
| 3 | POST | `/api/blogs` | Create new blog post |
| 4 | PUT | `/api/blogs/:id` | Update blog post (author only) |
| 5 | DELETE | `/api/blogs/:id` | Delete blog post (author only) |
| 6 | GET | `/api/blogs/:id/comments` | Fetch comments for a post |
| 7 | POST | `/api/blogs/:id/comments` | Add a comment |
| 8 | PUT | `/api/blogs/:id/comments/:cid` | Edit a comment (author only) |
| 9 | DELETE | `/api/blogs/:id/comments/:cid` | Delete a comment (author only) |
| 10 | POST | `/api/blogs/:id/like` | Toggle like/unlike |
| 11 | GET | `/api/blogs/tags` | Fetch popular tags with counts |
| 12 | POST | `/api/blogs/:id/bookmark` | Toggle bookmark |
| 13 | GET | `/api/users/bookmarks` | Fetch bookmarked articles |
| 14 | PUT | `/api/users/profile` | Update user profile |
| 15 | POST | `/api/users/register` | Register new user |
| 16 | POST | `/api/users/login` | Login (email/password) |
| 17 | POST | `/api/users/google-login` | Login via Google OAuth |
| 18 | POST | `/api/users/forgot-password` | Request password reset |
| 19 | POST | `/api/users/reset-password` | Reset password with token |

---

## 🧪 Testing

All features have been verified with 20 end-to-end API integration tests against the live backend:

- ✅ Authentication (Register + Login)
- ✅ Blog CRUD (Create, Read, Update, Delete)
- ✅ Comments (Add, Edit, Verify, Delete)
- ✅ Likes (Like, Unlike toggle)
- ✅ Bookmarks (Save, List, Unsave)
- ✅ Profile Update (Name, Bio, Socials)
- ✅ Tag Filtering & Popular Tags
- ✅ Sort by Popularity & Views
- ✅ Views Counter Increment
- ✅ OxLint: 0 warnings, 0 errors
- ✅ TypeScript: Zero type errors
- ✅ Production Build: Clean

---

## 📄 License

This project is part of a full-stack learning portfolio.

---

*Built with ❤️ by [musaCODEzz](https://github.com/musaCODEzz)*
