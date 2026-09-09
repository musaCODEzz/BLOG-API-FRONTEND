import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FeedPage } from './pages/FeedPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { EditPostPage } from './pages/EditPostPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import './App.css';

const NavigationHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const userInitial = (user?.name || 'U')[0].toUpperCase();

  return (
    <header className="blog-header">
      <div>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 className="brand-title">StackPulse</h1>
        </Link>
        <p className="brand-tagline">
          Modern ideas, architecture & developer stories.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="status-badge">
          <span className="status-dot"></span>
          <span>Render API Live</span>
        </div>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Link
              to="/create"
              style={{
                padding: '0.45rem 1rem',
                background: 'var(--accent-gradient)',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>+</span> Write Story
            </Link>

            <div className="author-chip" title={user?.email}>
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <span className="author-avatar">{userInitial}</span>
              )}
              <span className="author-name">{user?.name}</span>
            </div>

            <button
              onClick={logout}
              style={{
                padding: '0.45rem 0.85rem',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/login"
              style={{
                padding: '0.45rem 0.85rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              Sign In
            </Link>

            <Link
              to="/register"
              style={{
                padding: '0.45rem 1rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavigationHeader />

        {/* Dynamic Route Switching */}
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/blogs/:id" element={<PostDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/edit/:id" element={<EditPostPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
