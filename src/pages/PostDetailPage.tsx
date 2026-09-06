import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { BlogPost, Comment } from '../types/blog';
import { getBlogPostById, getCommentsByBlogId } from '../services/api';

export const PostDetailPage = () => {
  // 1. Grab the :id parameter from the URL bar!
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadPostAndComments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both post details and comments concurrently
        const [postData, commentsData] = await Promise.all([
          getBlogPostById(id),
          getCommentsByBlogId(id),
        ]);

        setPost(postData);
        setComments(commentsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPostAndComments();
  }, [id]); // Re-run if the URL id changes

  if (loading) {
    return (
      <div className="state-box">
        <p>⏳ Loading story & discussion...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="state-box error-box">
        <p>⚠️ {error || 'Post not found'}</p>
        <div style={{ marginTop: '1rem' }}>
          <Link to="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
            ← Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  const authorInitial = (post.author?.name || 'A')[0].toUpperCase();
  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article>
      {/* Back button */}
      <nav style={{ marginBottom: '2rem' }}>
        <Link 
          to="/" 
          style={{ 
            color: 'var(--text-secondary)', 
            textDecoration: 'none', 
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Back to Articles
        </Link>
      </nav>

      {/* Article Header */}
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="author-avatar">{authorInitial}</span>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              {post.author?.name || 'Anonymous'}
            </div>
            <time style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Published on {formattedDate}
            </time>
          </div>
        </div>
      </header>

      {/* Full Article Content */}
      <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-line', marginBottom: '3rem' }}>
        {post.content}
      </div>

      {/* Discussion & Comments Section */}
      <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Discussion ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <div className="state-box" style={{ padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No comments yet on this post. Be the first to start the conversation!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {comments.map((c) => (
              <div 
                key={c._id} 
                style={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: '8px', 
                  padding: '1rem 1.25rem' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {c.author?.name || 'Anonymous'}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem' }}>
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </article>
  );
};
