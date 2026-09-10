import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { BlogPost, PaginationInfo, TagCount } from '../types/blog';
import { getBlogs, getPopularTags } from '../services/api';
import { BlogCard } from '../components/BlogCard';

export const FeedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get('tag') || '';

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [popularTags, setPopularTags] = useState<TagCount[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>(''); // '' for latest, '-likesCount' for popular
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch popular tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getPopularTags();
        setPopularTags(tags);
      } catch {
        // Fallback silently if tags endpoint returns empty or fails
      }
    };
    fetchTags();
  }, []);

  // Fetch blogs whenever page, sortBy, or activeTag changes
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch specific page, sort, and tag from Render backend
        const response = await getBlogs(page, 10, sortBy || undefined, activeTag || undefined);
        setBlogs(response.data);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, sortBy, activeTag]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTag = (tag: string | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (tag) {
      nextParams.set('tag', tag);
    } else {
      nextParams.delete('tag');
    }
    setSearchParams(nextParams);
    setPage(1);
  };

  return (
    <main>
      <div className="feed-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="feed-title">
            {activeTag 
              ? `Articles in #${activeTag}` 
              : sortBy === '-views'
                ? '👀 Most Viewed Stories'
                : sortBy === '-likesCount' 
                  ? '🔥 Most Popular Stories' 
                  : 'Recent Articles'}
          </h2>
          {/* Shows total posts from MongoDB database! */}
          <span className="posts-count">
            {pagination ? `${pagination.total} total posts` : `${blogs.length} posts`}
          </span>
        </div>

        {/* Sort Switcher: Latest vs Popular vs Most Viewed */}
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
          <button
            type="button"
            className={`feed-tab ${sortBy === '-views' ? 'active' : ''}`}
            onClick={() => {
              if (sortBy !== '-views') {
                setSortBy('-views');
                setPage(1);
              }
            }}
          >
            <span>👀</span> Most Viewed
          </button>
        </div>
      </div>

      {/* Popular Topics Bar */}
      {popularTags.length > 0 && (
        <div className="popular-tags-bar">
          <button
            type="button"
            className={`topic-chip ${!activeTag ? 'active' : ''}`}
            onClick={() => handleSelectTag(null)}
          >
            <span>🌐</span> All Topics
          </button>
          {popularTags.map(({ tag, count }) => (
            <button
              key={tag}
              type="button"
              className={`topic-chip ${activeTag.toLowerCase() === tag.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleSelectTag(activeTag.toLowerCase() === tag.toLowerCase() ? null : tag)}
            >
              <span>#{tag}</span>
              <span className="topic-count">({count})</span>
            </button>
          ))}
        </div>
      )}

      {/* Active Tag Filter Banner */}
      {activeTag && (
        <div className="active-filter-banner">
          <span>
            Showing stories tagged with <strong style={{ color: 'var(--accent-primary)' }}>#{activeTag}</strong>
          </span>
          <button
            type="button"
            className="clear-filter-btn"
            onClick={() => handleSelectTag(null)}
          >
            ✕ Clear Filter
          </button>
        </div>
      )}

      {loading ? (
        <div className="state-box">
          <p>⏳ Fetching stories from Render backend...</p>
        </div>
      ) : error ? (
        <div className="state-box error-box">
          <p>⚠️ <strong>Error:</strong> {error}</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="state-box">
          <p>
            {activeTag
              ? `No blog posts found tagged with #${activeTag}.`
              : 'No blog posts found. Be the first to create one!'}
          </p>
          {activeTag && (
            <button
              type="button"
              onClick={() => handleSelectTag(null)}
              style={{
                marginTop: '1rem',
                padding: '0.45rem 1rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--accent-primary)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              View All Topics
            </button>
          )}
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
