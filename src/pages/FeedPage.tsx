import { useState, useEffect } from 'react';
import type { BlogPost, PaginationInfo } from '../types/blog';
import { getBlogs } from '../services/api';
import { BlogCard } from '../components/BlogCard';

export const FeedPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>(''); // '' for latest, '-likesCount' for popular
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch specific page and sort from Render backend
        const response = await getBlogs(page, 10, sortBy || undefined);
        setBlogs(response.data);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, sortBy]); // Re-runs automatically whenever page or sortBy changes!

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="state-box">
        <p>⏳ Fetching page {page} from Render backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-box error-box">
        <p>⚠️ <strong>Error:</strong> {error}</p>
      </div>
    );
  }

  return (
    <main>
      <div className="feed-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="feed-title">
            {sortBy === '-likesCount' ? '🔥 Most Popular Stories' : 'Recent Articles'}
          </h2>
          {/* Shows total posts from MongoDB database! */}
          <span className="posts-count">
            {pagination ? `${pagination.total} total posts` : `${blogs.length} posts`}
          </span>
        </div>

        {/* Sort Switcher: Latest vs Popular */}
        <div className="feed-tabs">
          <button
            type="button"
            className={`feed-tab ${sortBy === '' ? 'active' : ''}`}
            onClick={() => {
              if (sortBy !== '') {
                setSortBy('');
                setPage(1);
              }
            }}
          >
            <span>⏱️</span> Latest
          </button>
          <button
            type="button"
            className={`feed-tab ${sortBy === '-likesCount' ? 'active' : ''}`}
            onClick={() => {
              if (sortBy !== '-likesCount') {
                setSortBy('-likesCount');
                setPage(1);
              }
            }}
          >
            <span>🔥</span> Popular
          </button>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="state-box">
          <p>No blog posts found. Be the first to create one!</p>
        </div>
      ) : (
        <>
          <div className="blog-grid">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
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
                borderTop: '1px solid var(--border-subtle)'
              }}
            >
              <button
                onClick={() => handlePageChange(page - 1)}
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
                onClick={() => handlePageChange(page + 1)}
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
