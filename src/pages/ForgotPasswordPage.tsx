import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import { validateRealEmail } from '../utils/validation';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ message: string; resetToken?: string } | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Client-side Real Email Validation
    const validation = validateRealEmail(email);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email.trim());
      setSuccessInfo(res);
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
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
          Reset Password
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Enter the real email address associated with your account.
        </p>

        {error && (
          <div className="state-box error-box" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.85rem' }}>{error}</p>
          </div>
        )}

        {successInfo ? (
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
              <p style={{ margin: 0, fontWeight: 600 }}>{successInfo.message}</p>
            </div>

            {successInfo.resetToken && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Your password reset token has been generated:
                </p>
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    wordBreak: 'break-all',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1rem',
                  }}
                >
                  {successInfo.resetToken}
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/reset-password?token=${successInfo.resetToken}`)}
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
                  Continue to Set New Password →
                </button>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
                ← Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="you@gmail.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
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
              {loading ? 'Sending Request...' : 'Send Reset Link'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem', marginBottom: 0 }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
                Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
