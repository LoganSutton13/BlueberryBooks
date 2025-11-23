'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { apiClient, BookSearchResult } from '@/lib/api';
import { colors } from '@/theme';
import Link from 'next/link';

export default function SearchPage() {
  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
        <Navbar />
        <SearchContent />
      </div>
    </ProtectedRoute>
  );
}

function SearchContent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    const response = await apiClient.searchBooks(query, 20);
    
    if (response.data) {
      setResults(response.data.results);
    } else {
      setError(response.error || 'Failed to search books');
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
        Search Books
      </h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books..."
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
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}>
          {results.map((book) => (
            <BookCard key={book.open_library_id} book={book} />
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && !error && (
        <p style={{ color: colors.textSecondary, textAlign: 'center', marginTop: '2rem' }}>
          No books found. Try a different search term.
        </p>
      )}
    </div>
  );
}

function BookCard({ book }: { book: BookSearchResult }) {
  return (
    <Link
      href={`/book/${book.open_library_id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        backgroundColor: colors.white,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
    >
      {book.cover_image_url && (
        <img
          src={book.cover_image_url}
          alt={book.title}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            backgroundColor: colors.warmCream,
          }}
        />
      )}
      <div style={{ padding: '1rem' }}>
        <h3 style={{
          color: colors.textPrimary,
          marginBottom: '0.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {book.title}
        </h3>
        <p style={{
          color: colors.textSecondary,
          fontSize: '0.9rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {book.author}
        </p>
        {book.published_year && (
          <p style={{
            color: colors.textLight,
            fontSize: '0.8rem',
            marginTop: '0.25rem',
          }}>
            {book.published_year}
          </p>
        )}
      </div>
    </Link>
  );
}

