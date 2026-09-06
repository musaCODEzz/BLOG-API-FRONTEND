import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBlog } from '../services/api';

export const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If the user is not logged in, prompt them to sign in
  if (!isAuthenticated || !token) {
    return (
      <div className="state-box" style={{ maxWidth: '500px', margin: '3rem auto', padding: '3rem 2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Authentication Required
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          You must be signed in to author and publish articles on StackPulse.
        </p>
        <Link
          to="/login"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-gradient)',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
          }}
        >
          Sign In to Continue
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const newBlog = await createBlog(title, content, token);
      // Navigate to the newly created blog post!
      navigate(`/blogs/${newBlog._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '1rem auto' }}>
      <nav style={{ marginBottom: '1.5rem' }}>
        <Link 
          to="/" 
          style={{ 
            color: 'var(--text-secondary)', 
            textDecoration: 'none', 
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Cancel and return home
        </Link>
      </nav>

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '2.5rem',
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Write a New Story
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Share your engineering insights, architecture patterns, or lessons learned.
        </p>

        {error && (
          <div className="state-box error-box" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.85rem' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Article Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Architecting Scalable REST APIs with Express & MongoDB"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '1.05rem',
                fontWeight: 600,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Story Content
            </label>
            <textarea
              required
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article here..."
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                lineHeight: '1.6',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Link
              to="/"
              style={{
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.8rem 2rem',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--accent-gradient)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Publishing...' : 'Publish Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
