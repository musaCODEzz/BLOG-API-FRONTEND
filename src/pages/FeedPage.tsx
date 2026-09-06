import { useState, useEffect } from 'react';
import type { BlogPost } from '../types/blog';
import { getBlogs } from '../services/api';
import { BlogCard } from '../components/BlogCard';

export const FeedPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogs();
        setBlogs(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="state-box">
        <p>⏳ Fetching latest stories from Render backend...</p>
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
        <span className="posts-count">{blogs.length} posts</span>
      </div>

      {blogs.length === 0 ? (
        <div className="state-box">
          <p>No blog posts found. Be the first to create one!</p>
        </div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </main>
  );
};
