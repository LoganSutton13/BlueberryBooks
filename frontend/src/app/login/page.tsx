'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      padding: '1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: colors.white,
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{
          color: colors.textPrimary,
          marginBottom: '0.5rem',
          fontSize: '2rem',
          fontWeight: 'bold',
        }}>
          BlueberryBooks
        </h1>
        <p style={{
          color: colors.textSecondary,
          marginBottom: '2rem',
          fontSize: '0.9rem',
        }}>
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              backgroundColor: colors.warmBeige,
              color: colors.error,
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="username" style={{
              display: 'block',
              color: colors.textPrimary,
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${colors.border}`,
                borderRadius: '4px',
                fontSize: '1rem',
                color: colors.textPrimary,
                backgroundColor: colors.white,
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{
              display: 'block',
              color: colors.textPrimary,
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${colors.border}`,
                borderRadius: '4px',
                fontSize: '1rem',
                color: colors.textPrimary,
                backgroundColor: colors.white,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: colors.mediumBrown,
              color: colors.white,
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              marginBottom: '1rem',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{
          color: colors.textSecondary,
          textAlign: 'center',
          fontSize: '0.9rem',
        }}>
          Don't have an account?{' '}
          <Link href="/register" style={{
            color: colors.mediumBrown,
            textDecoration: 'none',
            fontWeight: '500',
          }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

