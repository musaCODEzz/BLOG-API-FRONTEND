import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { BlogPost, Comment } from '../types/blog';
import { getBlogPostById, getCommentsByBlogId, addComment, deleteBlog, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Story deletion state
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePostError, setDeletePostError] = useState<string | null>(null);

  // Comment state
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadPostAndComments = async () => {
      try {
        setLoading(true);
        setError(null);

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
  }, [id]);

  const handleDeletePost = async () => {
    if (!id || !token) return;

    try {
      setIsDeletingPost(true);
      setDeletePostError(null);
      await deleteBlog(id, token);
      // Successfully deleted! Navigate back to feed
      navigate('/', { replace: true });
    } catch (err: any) {
      setDeletePostError(err.message || 'Failed to delete story');
      setIsDeletingPost(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!id || !token) return;

    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;

    try {
      setDeletingCommentId(commentId);
      await deleteComment(id, commentId, token);
      // Remove comment from local state
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete comment');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleCommentSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!id || !commentText.trim() || !token) return;

    try {
      setSubmittingComment(true);
      setCommentError(null);
      const newComment = await addComment(id, commentText.trim(), token);
      // Prepend the new comment to the top of discussion
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
    } catch (err: any) {
      setCommentError(err.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

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

  const isBlogAuthor = Boolean(
    user && post.author && (user._id === post.author._id || user._id === (post.author as any))
  );

  return (
    <article>
      {/* Back navigation */}
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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
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

          {/* Author Actions: Edit & Delete Story */}
          {isBlogAuthor && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to={`/edit/${post._id}`}
                style={{
                  padding: '0.4rem 0.85rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>✏️</span> Edit Story
              </Link>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeletingPost}
                style={{
                  padding: '0.4rem 0.85rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  color: '#fca5a5',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>🗑️</span> Delete Story
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Card */}
        {showDeleteConfirm && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <strong style={{ color: '#fca5a5', display: 'block', fontSize: '0.9rem' }}>
                ⚠️ Delete this story permanently?
              </strong>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                This action cannot be undone. All discussion comments will also be deleted.
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeletingPost}
                style={{
                  padding: '0.4rem 0.8rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePost}
                disabled={isDeletingPost}
                style={{
                  padding: '0.4rem 0.85rem',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: isDeletingPost ? 'not-allowed' : 'pointer',
                }}
              >
                {isDeletingPost ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        )}

        {deletePostError && (
          <div className="state-box error-box" style={{ marginTop: '1rem', padding: '0.6rem 1rem' }}>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>{deletePostError}</p>
          </div>
        )}
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

        {/* Comment Form for Logged-In Users */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '2.5rem' }}>
            {commentError && (
              <div className="state-box error-box" style={{ padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '6px' }}>
                <p style={{ fontSize: '0.85rem' }}>{commentError}</p>
              </div>
            )}
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Add to the discussion as ${user?.name || 'Author'}...`}
              required
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical',
                marginBottom: '0.75rem',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--accent-gradient)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: submittingComment || !commentText.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--bg-card)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: '8px',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Want to join the conversation?
            </span>
            <Link
              to="/login"
              style={{
                padding: '0.45rem 1rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--accent-primary)',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              Sign In to Comment
            </Link>
          </div>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="state-box" style={{ padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {comments.map((c) => {
              const isCommentAuthor = Boolean(
                user && c.author && (user._id === c.author._id || user._id === (c.author as any))
              );

              return (
                <div 
                  key={c._id} 
                  style={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border-subtle)', 
                    borderRadius: '8px', 
                    padding: '1rem 1.25rem' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {c.author?.name || 'Anonymous'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                      {isCommentAuthor && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(c._id)}
                          disabled={deletingCommentId === c._id}
                          title="Delete your comment"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            padding: '0.2rem 0.4rem',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                        >
                          {deletingCommentId === c._id ? 'Deleting...' : '🗑️ Delete'}
                        </button>
                      )}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem' }}>
                    {c.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </article>
  );
};
