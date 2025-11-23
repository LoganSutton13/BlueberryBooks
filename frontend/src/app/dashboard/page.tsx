'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { StarRating } from '@/components/StarRating';
import { apiClient, Book, RatingWithBook, DiaryEntryWithBook } from '@/lib/api';
import { colors } from '@/theme';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
        <Navbar />
        <DashboardContent />
      </div>
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [readBooks, setReadBooks] = useState<Book[]>([]);
  const [topRatings, setTopRatings] = useState<RatingWithBook[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntryWithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'books' | 'ratings' | 'diary'>('books');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    const [booksRes, ratingsRes, diaryRes] = await Promise.all([
      apiClient.getUserReadBooks(),
      apiClient.getTop10Ratings(),
      apiClient.getDiaryEntries(),
    ]);

    if (booksRes.data) setReadBooks(booksRes.data);
    if (ratingsRes.data) setTopRatings(ratingsRes.data);
    if (diaryRes.data) setDiaryEntries(diaryRes.data);

    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        color: colors.textPrimary,
      }}>
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{
        color: colors.textPrimary,
        marginBottom: '2rem',
        fontSize: '2.5rem',
        fontWeight: 'bold',
      }}>
        My Dashboard
      </h1>

      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: `2px solid ${colors.border}`,
      }}>
        <button
          onClick={() => setActiveTab('books')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'books' ? `3px solid ${colors.mediumBrown}` : '3px solid transparent',
            color: activeTab === 'books' ? colors.mediumBrown : colors.textSecondary,
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeTab === 'books' ? '600' : '400',
          }}
        >
          Read Books ({readBooks.length})
        </button>
        <button
          onClick={() => setActiveTab('ratings')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'ratings' ? `3px solid ${colors.mediumBrown}` : '3px solid transparent',
            color: activeTab === 'ratings' ? colors.mediumBrown : colors.textSecondary,
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeTab === 'ratings' ? '600' : '400',
          }}
        >
          Top Rated ({topRatings.length})
        </button>
        <button
          onClick={() => setActiveTab('diary')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'diary' ? `3px solid ${colors.mediumBrown}` : '3px solid transparent',
            color: activeTab === 'diary' ? colors.mediumBrown : colors.textSecondary,
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeTab === 'diary' ? '600' : '400',
          }}
        >
          Diary Entries ({diaryEntries.length})
        </button>
      </div>

      {activeTab === 'books' && (
        <div>
          <h2 style={{
            color: colors.textPrimary,
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
          }}>
            All Books I've Read
          </h2>
          {readBooks.length === 0 ? (
            <div style={{
              backgroundColor: colors.white,
              padding: '3rem',
              borderRadius: '8px',
              textAlign: 'center',
              border: `1px solid ${colors.border}`,
            }}>
              <p style={{ color: colors.textSecondary, marginBottom: '1rem' }}>
                You haven't marked any books as read yet.
              </p>
              <Link
                href="/search"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: colors.mediumBrown,
                  color: colors.white,
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontWeight: '600',
                }}
              >
                Search for Books
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}>
              {readBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'ratings' && (
        <div>
          <h2 style={{
            color: colors.textPrimary,
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
          }}>
            Top 10 Rated Books
          </h2>
          {topRatings.length === 0 ? (
            <div style={{
              backgroundColor: colors.white,
              padding: '3rem',
              borderRadius: '8px',
              textAlign: 'center',
              border: `1px solid ${colors.border}`,
            }}>
              <p style={{ color: colors.textSecondary }}>
                You haven't rated any books yet.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}>
              {topRatings.map((rating) => (
                <RatingCard key={rating.id} rating={rating} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'diary' && (
        <div>
          <h2 style={{
            color: colors.textPrimary,
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
          }}>
            My Diary Entries
          </h2>
          {diaryEntries.length === 0 ? (
            <div style={{
              backgroundColor: colors.white,
              padding: '3rem',
              borderRadius: '8px',
              textAlign: 'center',
              border: `1px solid ${colors.border}`,
            }}>
              <p style={{ color: colors.textSecondary }}>
                You haven't written any diary entries yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {diaryEntries.map((entry) => (
                <DiaryEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
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
      </div>
    </Link>
  );
}

function RatingCard({ rating }: { rating: RatingWithBook }) {
  if (!rating.book) return null;

  const bookId = rating.book.open_library_id || rating.book.id.toString();
  
  return (
    <Link
      href={`/book/${bookId}`}
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
      {rating.book.cover_image_url && (
        <img
          src={rating.book.cover_image_url}
          alt={rating.book.title}
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
          {rating.book.title}
        </h3>
        <div style={{ marginTop: '0.5rem' }}>
          <StarRating rating={rating.rating} readonly size={20} />
        </div>
      </div>
    </Link>
  );
}

function DiaryEntryCard({ entry }: { entry: DiaryEntryWithBook }) {
  const date = new Date(entry.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{
      backgroundColor: colors.white,
      padding: '1.5rem',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
    }}>
      {entry.book && (
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {entry.book.cover_image_url && (
            <img
              src={entry.book.cover_image_url}
              alt={entry.book.title}
              style={{
                width: '60px',
                height: '90px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          )}
          <div>
            <Link
              href={`/book/${entry.book.open_library_id || entry.book.id}`}
              style={{
                color: colors.mediumBrown,
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
              }}
            >
              {entry.book.title}
            </Link>
            {entry.book.author && (
              <p style={{
                color: colors.textSecondary,
                fontSize: '0.9rem',
                marginTop: '0.25rem',
              }}>
                by {entry.book.author}
              </p>
            )}
          </div>
        </div>
      )}
      <p style={{
        color: colors.textPrimary,
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
        marginBottom: '0.5rem',
      }}>
        {entry.entry_text}
      </p>
      <p style={{
        color: colors.textLight,
        fontSize: '0.85rem',
      }}>
        {date}
      </p>
    </div>
  );
}

