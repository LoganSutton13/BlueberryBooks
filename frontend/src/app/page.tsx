'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Redirect to dashboard if authenticated
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: colors.background,
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
      }}>
        <h1 style={{
          color: colors.textPrimary,
          marginBottom: '1rem',
          fontSize: '3rem',
          fontWeight: 'bold',
        }}>
          BlueberryBooks
        </h1>
        <p style={{
          color: colors.textSecondary,
          marginBottom: '3rem',
          fontSize: '1.2rem',
        }}>
          Your personal book diary for reviews and ratings
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link
            href="/login"
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: colors.mediumBrown,
              color: colors.white,
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: colors.lightBrown,
              color: colors.textPrimary,
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}

