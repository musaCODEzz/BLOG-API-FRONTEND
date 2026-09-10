import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../types/blog';
import { BookmarkButton } from './BookmarkButton';

interface BlogCardProps {
  blog: BlogPost;
  initialBookmarked?: boolean;
  onBookmarkToggle?: (isBookmarked: boolean) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  initialBookmarked,
  onBookmarkToggle,
}) => {
  const authorInitial = (blog.author?.name || 'A')[0].toUpperCase();
  const formattedDate = new Date(blog.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="blog-card">
      <Link 
        to={`/blogs/${blog._id}`} 
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <h3 className="card-title">{blog.title}</h3>
        <p className="card-content">{blog.content}</p>
      </Link>

      {blog.tags && blog.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.85rem' }}>
          {blog.tags.map((tag) => (
            <Link
              key={tag}
              to={`/?tag=${encodeURIComponent(tag)}`}
              className="tag-pill"
              onClick={(e) => e.stopPropagation()}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Metrics Row: Reading Time & Views */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
        <span className="meta-metric" title="Estimated Reading Time">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{blog.readTime || '1 min read'}</span>
        </span>

        <span style={{ color: 'var(--border-subtle)' }}>•</span>

        <span className="meta-metric" title="Total Views">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>{(blog.views || 0).toLocaleString()} views</span>
        </span>
      </div>

      <footer className="card-footer">
        <div className="author-chip">
          {blog.author?.avatar ? (
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <span className="author-avatar">{authorInitial}</span>
          )}
          <span className="author-name">{blog.author?.name || 'Anonymous'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {(blog.likesCount !== undefined && blog.likesCount > 0) && (
            <span 
              title={`${blog.likesCount} ${blog.likesCount === 1 ? 'like' : 'likes'}`}
              style={{ 
                fontSize: '0.8rem', 
                color: '#f43f5e', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                fontWeight: 600,
              }}
            >
              ❤️ {blog.likesCount}
            </span>
          )}
          
          <time dateTime={blog.createdAt} style={{ fontSize: '0.8rem' }}>{formattedDate}</time>

          <BookmarkButton
            blogId={blog._id}
            initialBookmarked={initialBookmarked}
            size="sm"
            onToggle={onBookmarkToggle}
          />
        </div>
      </footer>
    </article>
  );
};

