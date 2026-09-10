import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost, PaginationInfo } from '../types/blog';
import { getUserBookmarks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BlogCard } from '../components/BlogCard';

export const SavedArticlesPage: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const [bookmarks, setBookmarks] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(() => Boolean(token));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchBookmarks = async () => {

      try {
        setLoading(true);
        setError(null);
        const res = await getUserBookmarks(token, page, 10);
        setBookmarks(res.data);
        setPagination(res.pagination);
      } catch (err: any) {
        setError(err.message || 'Failed to load saved stories');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [token, page]);

  if (!isAuthenticated || !token) {
    return (
      <div className="state-box">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          🔒 Authentication Required
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Please sign in to view your saved reading list.
        </p>
        <Link
          to="/login"
          style={{
            padding: '0.5rem 1.25rem',
            background: 'var(--accent-gradient)',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Sign In
        </Link>
      </div>
    );
  }

  const handleBookmarkToggle = (blogId: string, isBookmarked: boolean) => {
    if (!isBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b._id !== blogId));
      if (pagination) {
        setPagination((prev) => prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev);
      }
    }
  };

  return (
    <main>
      <div className="feed-header">
        <div>
          <h2 className="feed-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔖</span>
            <span>Saved Reading List</span>
          </h2>
          <span className="posts-count">
            {pagination ? `${pagination.total} saved articles` : `${bookmarks.length} saved`}
          </span>
        </div>

        <Link
          to="/"
          style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          ← Back to Feed
        </Link>
      </div>

      {loading ? (
        <div className="state-box">
          <p>⏳ Loading your saved articles...</p>
        </div>
      ) : error ? (
        <div className="state-box error-box">
          <p>⚠️ <strong>Error:</strong> {error}</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="state-box">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📖</div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Your Reading List is Empty
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            Bookmark stories you want to read or reference later. Click the bookmark icon on any story card to save it here!
          </p>
          <Link
            to="/"
            style={{
              padding: '0.55rem 1.25rem',
              background: 'var(--accent-gradient)',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>Explore Feed</span> →
          </Link>
        </div>
      ) : (
        <>
          <div className="blog-grid">
            {bookmarks.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                initialBookmarked={true}
                onBookmarkToggle={(isSaved) => handleBookmarkToggle(blog._id, isSaved)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1.25rem',
                marginTop: '3rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <button
                onClick={() => {
                  setPage(page - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={!pagination.hasPrevPage}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: pagination.hasPrevPage ? 'var(--bg-card)' : 'transparent',
                  color: pagination.hasPrevPage ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                ← Previous
              </button>

              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Page <strong style={{ color: 'var(--text-primary)' }}>{pagination.page}</strong> of{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{pagination.totalPages}</strong>
              </span>

              <button
                onClick={() => {
                  setPage(page + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={!pagination.hasNextPage}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: pagination.hasNextPage ? 'var(--bg-card)' : 'transparent',
                  color: pagination.hasNextPage ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};
