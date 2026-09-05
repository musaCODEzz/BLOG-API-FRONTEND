import { useState, useEffect } from 'react';
import './App.css';

interface Author {
  _id: string;
  name: string;
  email: string;
}

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author?: Author;
  createdAt: string;
}

function App() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://blog-api-backend-mh0s.onrender.com/api/blogs');

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const result = await response.json();
        setBlogs(result.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch blogs from Render');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      {/* Header with gradient title & live status indicator */}
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

      {/* Loading State */}
      {loading && (
        <div className="state-box">
          <p>⏳ Fetching latest stories from Render backend...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="state-box error-box">
          <p>⚠️ <strong>Error:</strong> {error}</p>
        </div>
      )}

      {/* Success State: Blog Feed */}
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
              {blogs.map((blog) => {
                const authorInitial = (blog.author?.name || 'A')[0].toUpperCase();
                const formattedDate = new Date(blog.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <article key={blog._id} className="blog-card">
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
              })}
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
