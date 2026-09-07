import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateRealEmail } from '../utils/validation';
import { PasswordInput } from '../components/PasswordInput';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email format
    const emailValidation = validateRealEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      // Redirect to home feed upon successful login
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
          Welcome Back
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Sign in to your StackPulse author account.
        </p>

        {error && (
          <div className="state-box error-box" style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', borderRadius: '6px' }}>
            <p style={{ fontSize: '0.85rem' }}>{error}</p>
          </div>
        )}

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

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Password
              </label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};
