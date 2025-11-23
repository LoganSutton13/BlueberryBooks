'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

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
  }, []);

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ color: '#000000', marginBottom: '1rem' }}>
        Welcome to BlueberryBooks
      </h1>
      <p style={{ color: '#333333', marginBottom: '2rem' }}>
        Your personal book diary
      </p>
      <button
        onClick={() => router.push('/login')}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#8B6F47',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          marginRight: '1rem',
        }}
      >
        Login
      </button>
      <button
        onClick={() => router.push('/register')}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#D4A574',
          color: '#000000',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
        }}
      >
        Register
      </button>
    </main>
  );
}

