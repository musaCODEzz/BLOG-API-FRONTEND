import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { PasswordInput } from '../components/PasswordInput';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError('A reset token is required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token.trim(), password);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto' }}>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Set New Password
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Create a secure new password for your account.
        </p>

        {error && (
          <div className="state-box error-box" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.85rem' }}>{error}</p>
          </div>
        )}

        {isSuccess ? (
          <div>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                color: '#6ee7b7',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                marginBottom: '1.5rem',
              }}
            >
              <p style={{ margin: 0, fontWeight: 600 }}>
                🎉 Your password has been successfully reset!
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--accent-gradient)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              Sign In with New Password →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!tokenFromUrl && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Reset Token
                </label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste reset token here"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none',
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                New Password
              </label>
              <PasswordInput
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Confirm New Password
              </label>
              <PasswordInput
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--accent-gradient)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
              }}
            >
              {loading ? 'Updating Password...' : 'Set New Password'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem', marginBottom: 0 }}>
              <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                Cancel and return to Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
