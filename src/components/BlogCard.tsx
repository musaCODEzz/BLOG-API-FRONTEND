import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../types/blog';

interface BlogCardProps {
  blog: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
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

      <footer className="card-footer">
        <div className="author-chip">
          <span className="author-avatar">{authorInitial}</span>
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
          <time dateTime={blog.createdAt}>{formattedDate}</time>
        </div>
      </footer>
    </article>
  );
};
