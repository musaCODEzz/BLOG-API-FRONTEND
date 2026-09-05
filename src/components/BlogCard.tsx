import React from 'react';
import type { BlogPost } from '../types/blog';

// 1. Define what props (inputs) this component expects
interface BlogCardProps {
  blog: BlogPost;
}

// 2. The BlogCard component receives { blog } as its prop
export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const authorInitial = (blog.author?.name || 'A')[0].toUpperCase();
  const formattedDate = new Date(blog.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="blog-card">
      <h3 className="card-title">{blog.title}</h3>
      <p className="card-content">{blog.content}</p>
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
