import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user, token, isAuthenticated, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    website: user?.website || '',
    github: user?.github || '',
    twitter: user?.twitter || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [avatarError, setAvatarError] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [status, setStatus] = useState<{ loading: boolean; error: string | null; success: string | null }>({
    loading: false,
    error: null,
    success: null,
  });

  if (!isAuthenticated || !token || !user) {
    return (
      <div className="state-box">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          🔒 Authentication Required
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Please sign in to view and edit your profile settings.
        </p>
        <Link
          to="/login"
          style={{
            padding: '0.5rem 1.25rem',
            background: 'var(--accent-gradient)',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Sign In
        </Link>
      </div>
    );
  }

  const userInitial = (formData.name || user.name || 'U')[0].toUpperCase();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    // Validate password fields if user is changing password
    if (formData.newPassword || formData.oldPassword) {
      if (!formData.oldPassword) {
        setStatus({ loading: false, error: 'Current password is required to set a new password.', success: null });
        return;
      }
      if (formData.newPassword.length < 6) {
        setStatus({ loading: false, error: 'New password must be at least 6 characters.', success: null });
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setStatus({ loading: false, error: 'New passwords do not match.', success: null });
        return;
      }
    }

    try {
      const payload: Record<string, string> = {
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        avatar: formData.avatar.trim(),
        website: formData.website.trim(),
        github: formData.github.trim(),
        twitter: formData.twitter.trim(),
      };

      if (formData.newPassword) {
        payload.oldPassword = formData.oldPassword;
        payload.newPassword = formData.newPassword;
      }

      const res = await updateUserProfile(payload, token);
      updateUser(res.user);

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setShowPasswordSection(false);

      setStatus({
        loading: false,
        error: null,
        success: 'Profile updated successfully!',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Clear success message after 4s
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: null }));
      }, 4000);
    } catch (err: any) {
      setStatus({
        loading: false,
        error: err.message || 'Failed to update profile. Please try again.',
        success: null,
      });
    }
  };

  return (
    <div className="profile-container">
      {/* Back link */}
      <nav style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/"
          style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          ← Back to Articles
        </Link>
      </nav>

      <div className="profile-card">
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
          Edit Profile
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          Customize your public author presence and account settings on StackPulse.
        </p>

        {status.error && (
          <div className="state-box error-box" style={{ marginBottom: '1.5rem', padding: '0.85rem 1.25rem' }}>
            <p style={{ margin: 0, fontSize: '0.88rem' }}>⚠️ {status.error}</p>
          </div>
        )}

        {status.success && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '0.85rem 1.25rem',
              background: 'var(--success-bg)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              color: 'var(--success)',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span>✅</span> {status.success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="post-form">
          {/* Avatar Preview Row */}
          <div className="profile-avatar-row">
            {formData.avatar && !avatarError ? (
              <img
                src={formData.avatar}
                alt={formData.name || 'User Avatar'}
                className="profile-avatar-preview"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="profile-avatar-fallback">{userInitial}</div>
            )}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formData.name || user.name}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.email}</p>
            </div>
          </div>

          {/* Display Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">
              Display Name
            </label>
            <input
              id="profile-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g. Alex Rivera"
            />
          </div>

          {/* Bio Field */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="profile-bio">
                Author Bio
              </label>
              <span className="char-counter">{formData.bio.length} / 300</span>
            </div>
            <textarea
              id="profile-bio"
              maxLength={300}
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="form-textarea"
              placeholder="Tell readers about yourself, what you build, and your interests..."
            />
          </div>

          {/* Avatar URL */}
          <div className="form-group">
            <label className="form-label" htmlFor="profile-avatar">
              Avatar Image URL
            </label>
            <input
              id="profile-avatar"
              type="text"
              value={formData.avatar}
              onChange={(e) => {
                setAvatarError(false);
                setFormData({ ...formData, avatar: e.target.value });
              }}
              className="form-input"
              placeholder="https://images.unsplash.com/photo-... or your image URL"
            />
          </div>

          {/* Social Links Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="profile-website">
                🌐 Website / Blog
              </label>
              <input
                id="profile-website"
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="form-input"
                placeholder="https://mysite.dev"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="profile-github">
                🐙 GitHub Username
              </label>
              <input
                id="profile-github"
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="form-input"
                placeholder="e.g. torvalds"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="profile-twitter">
                🐦 Twitter / X
              </label>
              <input
                id="profile-twitter"
                type="text"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="form-input"
                placeholder="e.g. username"
              />
            </div>
          </div>

          {/* Password Change Toggle */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: 0,
              }}
            >
              <span>🔑</span>
              <span>{showPasswordSection ? 'Cancel Password Change' : 'Change Password (Optional)'}</span>
            </button>

            {showPasswordSection && (
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="profile-old-pwd">
                    Current Password
                  </label>
                  <input
                    id="profile-old-pwd"
                    type="password"
                    value={formData.oldPassword}
                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    className="form-input"
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="profile-new-pwd">
                    New Password (min 6 characters)
                  </label>
                  <input
                    id="profile-new-pwd"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="form-input"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="profile-confirm-pwd">
                    Confirm New Password
                  </label>
                  <input
                    id="profile-confirm-pwd"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="form-input"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            id="save-profile-btn"
            type="submit"
            disabled={status.loading}
            className="submit-btn"
            style={{ width: '100%', padding: '0.75rem' }}
          >
            {status.loading ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
