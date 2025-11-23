'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav style={{
      backgroundColor: colors.white,
      borderBottom: `1px solid ${colors.border}`,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <Link href="/dashboard" style={{
        color: colors.textPrimary,
        textDecoration: 'none',
        fontSize: '1.5rem',
        fontWeight: 'bold',
      }}>
        BlueberryBooks
      </Link>
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
      }}>
        <Link href="/search" style={{
          color: colors.textPrimary,
          textDecoration: 'none',
          fontSize: '1rem',
        }}>
          Search Books
        </Link>
        <Link href="/dashboard" style={{
          color: colors.textPrimary,
          textDecoration: 'none',
          fontSize: '1rem',
        }}>
          Dashboard
        </Link>
        <span style={{
          color: colors.textSecondary,
          fontSize: '0.9rem',
        }}>
          {user?.username}
        </span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            border: `1px solid ${colors.border}`,
            color: colors.textPrimary,
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

