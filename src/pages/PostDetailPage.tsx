import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { BlogPost, Comment } from '../types/blog';
import { getBlogPostById, getCommentsByBlogId, addComment, deleteBlog, deleteComment, updateComment, likeBlogPost } from '../services/api';
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

  // Comment edit state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [updatingComment, setUpdatingComment] = useState(false);
  const [editCommentError, setEditCommentError] = useState<string | null>(null);

  // Likes & Engagement state
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isHeartPopping, setIsHeartPopping] = useState<boolean>(false);
  const [likeTooltip, setLikeTooltip] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

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
        setLikesCount(postData.likesCount || 0);

        if (user && postData.likes) {
          const userLiked = (postData.likes as any[]).some(
            (l) => (typeof l === 'string' ? l === user._id : l?._id === user._id)
          );
          setIsLiked(userLiked);
        } else {
          setIsLiked(false);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPostAndComments();
  }, [id, user]);

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

  const handleStartEditComment = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.content);
    setEditCommentError(null);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
    setEditCommentError(null);
  };

  const handleSaveEditComment = async (commentId: string) => {
    if (!id || !token || !editingCommentText.trim()) return;

    try {
      setUpdatingComment(true);
      setEditCommentError(null);
      const updated = await updateComment(id, commentId, editingCommentText.trim(), token);
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
                ...c,
                content: updated?.content || editingCommentText.trim(),
                updatedAt: updated?.updatedAt || new Date().toISOString(),
              }
            : c
        )
      );
      setEditingCommentId(null);
      setEditingCommentText('');
    } catch (err: any) {
      setEditCommentError(err.message || 'Failed to update comment');
    } finally {
      setUpdatingComment(false);
    }
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated || !token || !id) {
      setLikeTooltip('Please sign in to like this story! ❤️');
      setTimeout(() => setLikeTooltip(null), 4000);
      return;
    }

    if (isLiking) return;

    // Trigger bounce micro-animation
    setIsHeartPopping(true);
    setTimeout(() => setIsHeartPopping(false), 350);

    // Optimistic UI update
    const prevIsLiked = isLiked;
    const prevLikesCount = likesCount;
    const nextIsLiked = !isLiked;
    const nextLikesCount = nextIsLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

    setIsLiked(nextIsLiked);
    setLikesCount(nextLikesCount);
    setIsLiking(true);

    try {
      const res = await likeBlogPost(id, token);
      setIsLiked(res.isLiked);
      setLikesCount(res.likesCount);
      setPost((prev) => (prev ? { ...prev, likesCount: res.likesCount } : prev));
    } catch (err: any) {
      // Rollback on error
      setIsLiked(prevIsLiked);
      setLikesCount(prevLikesCount);
      alert(err.message || 'Failed to update like. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleShareArticle = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.15rem' }}>
                <time style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Published on {formattedDate}
                </time>
                <span style={{ fontSize: '0.8rem', color: isLiked ? '#f43f5e' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  {isLiked ? '❤️' : '🤍'} {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                </span>
              </div>
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
      <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-line', marginBottom: '2.5rem' }}>
        {post.content}
      </div>

      {/* Article Engagement Bar */}
      <div className="engagement-bar">
        <div className="engagement-actions">
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`like-button ${isLiked ? 'liked' : ''}`}
            title={isAuthenticated ? (isLiked ? 'Unlike this story' : 'Like this story') : 'Sign in to like'}
          >
            <span className={`like-icon ${isHeartPopping ? 'heart-popping' : ''}`} style={{ fontSize: '1.15rem' }}>
              {isLiked ? '❤️' : '🤍'}
            </span>
            <span>{likesCount}</span>
          </button>

          <a
            href="#discussion"
            className="engagement-icon-btn"
            title="Jump to discussion"
          >
            <span>💬</span>
            <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
          </a>

          <button
            type="button"
            onClick={handleShareArticle}
            className="engagement-icon-btn"
            title="Copy story link"
          >
            <span>{copiedLink ? '✅' : '🔗'}</span>
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Unauthenticated notification hint */}
        {likeTooltip && (
          <div style={{ fontSize: '0.85rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{likeTooltip}</span>
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Discussion & Comments Section */}
      <section id="discussion" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '2.5rem' }}>
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
              const isEditing = editingCommentId === c._id;

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
                        {c.updatedAt && c.updatedAt !== c.createdAt && (
                          <span style={{ fontStyle: 'italic', marginLeft: '0.35rem', fontSize: '0.75rem' }}>(edited)</span>
                        )}
                      </span>
                      {isCommentAuthor && !isEditing && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => handleStartEditComment(c)}
                            title="Edit your comment"
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
                              transition: 'color 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary, #6366f1)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                          >
                            ✏️ Edit
                          </button>
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
                              cursor: deletingCommentId === c._id ? 'not-allowed' : 'pointer',
                              padding: '0.2rem 0.4rem',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              transition: 'color 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                          >
                            {deletingCommentId === c._id ? 'Deleting...' : '🗑️ Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div style={{ marginTop: '0.75rem' }}>
                      <textarea
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'var(--bg-secondary, #1e293b)',
                          border: '1px solid var(--border-subtle, #334155)',
                          borderRadius: '6px',
                          color: 'var(--text-primary, #f8fafc)',
                          fontFamily: 'inherit',
                          fontSize: '0.95rem',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                          outline: 'none',
                          lineHeight: 1.5,
                        }}
                        placeholder="Edit your comment..."
                        disabled={updatingComment}
                      />
                      {editCommentError && (
                        <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '0.4rem 0' }}>
                          ⚠️ {editCommentError}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={handleCancelEditComment}
                          disabled={updatingComment}
                          style={{
                            padding: '0.4rem 0.85rem',
                            background: 'transparent',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)',
                            borderRadius: '6px',
                            cursor: updatingComment ? 'not-allowed' : 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEditComment(c._id)}
                          disabled={updatingComment || !editingCommentText.trim()}
                          style={{
                            padding: '0.4rem 0.85rem',
                            background: 'var(--accent-gradient, #6366f1)',
                            border: 'none',
                            color: '#ffffff',
                            borderRadius: '6px',
                            cursor: updatingComment || !editingCommentText.trim() ? 'not-allowed' : 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            opacity: updatingComment || !editingCommentText.trim() ? 0.6 : 1,
                          }}
                        >
                          {updatingComment ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {c.content}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </article>
  );
};
