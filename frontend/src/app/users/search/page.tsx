'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { apiClient, UserSearchResult } from '@/lib/api';
import { colors } from '@/theme';
import Link from 'next/link';

export default function UserSearchPage() {
  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
        <Navbar />
        <UserSearchContent />
      </div>
    </ProtectedRoute>
  );
}

function UserSearchContent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    const response = await apiClient.searchUsers(query);
    
    if (response.data) {
      setResults(response.data.results);
    } else {
      setError(response.error || 'Failed to search users');
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{
        color: colors.textPrimary,
        marginBottom: '2rem',
        fontSize: '2rem',
        fontWeight: 'bold',
      }}>
        Search Users
      </h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for users by username..."
            style={{
              flex: 1,
              padding: '0.75rem',
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              fontSize: '1rem',
              color: colors.textPrimary,
              backgroundColor: colors.white,
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: colors.mediumBrown,
              color: colors.white,
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{
          backgroundColor: colors.warmBeige,
          color: colors.error,
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {results.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && !error && (
        <p style={{ color: colors.textSecondary, textAlign: 'center', marginTop: '2rem' }}>
          No users found. Try a different search term.
        </p>
      )}
    </div>
  );
}

function UserCard({ user }: { user: UserSearchResult }) {
  return (
    <Link
      href={`/users/${user.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        backgroundColor: colors.white,
        borderRadius: '8px',
        padding: '1.5rem',
        border: `1px solid ${colors.border}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{
            color: colors.textPrimary,
            marginBottom: '0.5rem',
            fontSize: '1.2rem',
            fontWeight: '600',
          }}>
            {user.username}
          </h3>
          {user.is_private && (
            <span style={{
              color: colors.textSecondary,
              fontSize: '0.9rem',
              fontStyle: 'italic',
            }}>
              Private Profile
            </span>
          )}
        </div>
        <span style={{
          color: colors.mediumBrown,
          fontSize: '0.9rem',
        }}>
          View Profile →
        </span>
      </div>
    </Link>
  );
}

