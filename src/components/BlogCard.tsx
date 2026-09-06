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
        <time dateTime={blog.createdAt}>{formattedDate}</time>
      </footer>
    </article>
  );
};
