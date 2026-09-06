import { useState, useEffect } from 'react';
import type { BlogPost, PaginationInfo } from '../types/blog';
import { getBlogs } from '../services/api';
import { BlogCard } from '../components/BlogCard';

export const FeedPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch specific page from Render backend
        const response = await getBlogs(page, 10);
        setBlogs(response.data);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]); // Re-runs automatically whenever `page` changes!

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
      <div className="feed-header">
        <h2 className="feed-title">Recent Articles</h2>
        {/* Shows total posts from MongoDB database! */}
        <span className="posts-count">
          {pagination ? `${pagination.total} total posts` : `${blogs.length} posts`}
        </span>
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
