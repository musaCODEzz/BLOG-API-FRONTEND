import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FeedPage } from './pages/FeedPage';
import { PostDetailPage } from './pages/PostDetailPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* Brand Header — Stays at the top of every page */}
      <header className="blog-header">
        <div>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className="brand-title">StackPulse</h1>
          </Link>
          <p className="brand-tagline">
            Modern ideas, architecture & developer stories.
          </p>
        </div>
        <div className="status-badge">
          <span className="status-dot"></span>
          <span>Render API Live</span>
        </div>
      </header>

      {/* Dynamic Route Switching */}
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/blogs/:id" element={<PostDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
