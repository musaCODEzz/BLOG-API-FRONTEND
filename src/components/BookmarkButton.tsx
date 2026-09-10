import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toggleBookmark } from '../services/api';

interface BookmarkButtonProps {
  blogId: string;
  initialBookmarked?: boolean;
  size?: 'sm' | 'md';
  showText?: boolean;
  onToggle?: (isBookmarked: boolean) => void;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  blogId,
  initialBookmarked = false,
  size = 'md',
  showText = false,
  onToggle,
}) => {
  const { user, token, isAuthenticated } = useAuth();
  
  // Track user override or derive from prop / user state
  const [overrideBookmarked, setOverrideBookmarked] = useState<boolean | null>(null);
  const isBookmarked = overrideBookmarked !== null
    ? overrideBookmarked
    : (initialBookmarked ?? (Boolean(user?.bookmarks && Array.isArray(user.bookmarks) && user.bookmarks.includes(blogId))));

  const [saving, setSaving] = useState(false);
  const [promptAuth, setPromptAuth] = useState(false);


  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated || !token) {
      setPromptAuth(true);
      setTimeout(() => setPromptAuth(false), 3000);
      return;
    }

    if (saving) return;

    // Optimistic toggle
    const prev = isBookmarked;
    setOverrideBookmarked(!prev);
    setSaving(true);

    try {
      const res = await toggleBookmark(blogId, token);
      setOverrideBookmarked(res.isBookmarked);
      if (onToggle) {
        onToggle(res.isBookmarked);
      }
    } catch {
      // Rollback on failure
      setOverrideBookmarked(prev);
    } finally {
      setSaving(false);
    }
  };

  const isSmall = size === 'sm';

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={saving}
        className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''} ${isSmall ? 'bookmark-sm' : ''} ${saving ? 'saving' : ''}`}
        title={isBookmarked ? 'Remove from Saved Articles' : 'Save to Reading List'}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
      >
        <svg
          viewBox="0 0 24 24"
          width={isSmall ? '13' : '15'}
          height={isSmall ? '13' : '15'}
          fill={isBookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>

        {showText && (
          <span style={{ fontSize: isSmall ? '0.75rem' : '0.82rem' }}>
            {isBookmarked ? 'Saved' : 'Save'}
          </span>
        )}
      </button>

      {promptAuth && (
        <div
          style={{
            position: 'absolute',
            bottom: '125%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--accent-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.75rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        >
          🔒 Sign in to save stories!
        </div>
      )}
    </div>
  );
};
