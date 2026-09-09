import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBlogPostById, updateBlog } from '../services/api';
import type { BlogPost } from '../types/blog';

export const EditPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogPostById(id);
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (err: any) {
        setError(err.message || 'Failed to load story for editing');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  // 1. Not signed in check
  if (!isAuthenticated || !token) {
    return (
      <div className="state-box" style={{ maxWidth: '500px', margin: '3rem auto', padding: '3rem 2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Authentication Required
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          You must be signed in to edit articles on StackPulse.
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

  // 2. Loading state
  if (loading) {
    return (
      <div className="state-box" style={{ maxWidth: '760px', margin: '3rem auto' }}>
        <p>⏳ Loading story for editing...</p>
      </div>
    );
  }

  // 3. Post not found or error loading
  if (error || !post) {
    return (
      <div className="state-box error-box" style={{ maxWidth: '760px', margin: '3rem auto' }}>
        <p>⚠️ {error || 'Story not found'}</p>
        <div style={{ marginTop: '1rem' }}>
          <Link to="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
            ← Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  // 4. Ownership check: Only the author may edit
  const isAuthor = user && post.author && (user._id === post.author._id || user._id === (post.author as any));
  if (!isAuthor) {
    return (
      <div className="state-box error-box" style={{ maxWidth: '500px', margin: '3rem auto', padding: '2.5rem 2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Access Denied
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          You are not the author of this story. Only the original author can make changes.
        </p>
        <Link
          to={`/blogs/${id}`}
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
          }}
        >
          ← Return to Story
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!id || !title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await updateBlog(id, title.trim(), content.trim(), token);
      // Navigate back to the updated post
      navigate(`/blogs/${id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update story');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '1rem auto' }}>
      <nav style={{ marginBottom: '1.5rem' }}>
        <Link 
          to={`/blogs/${id}`} 
          style={{ 
            color: 'var(--text-secondary)', 
            textDecoration: 'none', 
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Cancel and return to story
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
          Edit Story
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Make updates to your article and publish the revised version.
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
              placeholder="Article Title"
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
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Article Content..."
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
              to={`/blogs/${id}`}
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
              disabled={saving}
              style={{
                padding: '0.8rem 2rem',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--accent-gradient)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Saving changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
