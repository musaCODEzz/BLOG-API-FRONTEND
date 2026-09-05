import { useState, useEffect } from 'react';
import type { BlogPost } from './types/blog';
import { getBlogs } from './services/api';
import { BlogCard } from './components/BlogCard';
import './App.css';

function App() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        // Call our centralized API function!
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

  return (
    <div>
      {/* Brand Header */}
      <header className="blog-header">
        <div>
          <h1 className="brand-title">StackPulse</h1>
          <p className="brand-tagline">
            Modern ideas, architecture & developer stories.
          </p>
        </div>
        <div className="status-badge">
          <span className="status-dot"></span>
          <span>Render API Live</span>
        </div>
      </header>

      {/* State 1: Loading */}
      {loading && (
        <div className="state-box">
          <p>⏳ Fetching latest stories from Render backend...</p>
        </div>
      )}

      {/* State 2: Error */}
      {error && (
        <div className="state-box error-box">
          <p>⚠️ <strong>Error:</strong> {error}</p>
        </div>
      )}

      {/* State 3: Feed using our reusable BlogCard */}
      {!loading && !error && (
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
      )}
    </div>
  );
}

export default App;
