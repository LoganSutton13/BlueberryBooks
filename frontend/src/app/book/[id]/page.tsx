'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { StarRating } from '@/components/StarRating';
import { apiClient, Book, BookSearchResult } from '@/lib/api';
import { colors } from '@/theme';

export default function BookDetailPage() {
  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
        <Navbar />
        <BookDetailContent />
      </div>
    </ProtectedRoute>
  );
}

function BookDetailContent() {
  const params = useParams();
  const router = useRouter();
  const openLibraryId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [searchResult, setSearchResult] = useState<BookSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [diaryEntry, setDiaryEntry] = useState('');
  const [existingDiaryEntry, setExistingDiaryEntry] = useState<any>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [existingRating, setExistingRating] = useState<any>(null);
  const [isRead, setIsRead] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBookData();
  }, [openLibraryId]);

  const loadBookData = async () => {
    setLoading(true);
    setError('');

    // First, get book details from Open Library to show immediately
    const searchResponse = await apiClient.searchBooks(openLibraryId, 1);
    if (searchResponse.data?.results?.[0]) {
      setSearchResult(searchResponse.data.results[0]);
    }

    // Try to add book to our database (or get existing one)
    const addResponse = await apiClient.addBook(openLibraryId);
    let bookId: number | null = null;
    
    if (addResponse.data) {
      bookId = addResponse.data.book_id;
      // Get the book details from our database
      const bookResponse = await apiClient.getBook(bookId);
      if (bookResponse.data) {
        setBook(bookResponse.data);
      }
    } else {
      // If add failed, try to find existing book by checking read books
      // This is a workaround - in production, you'd want a better search endpoint
      const readBooksResponse = await apiClient.getUserReadBooks();
      if (readBooksResponse.data) {
        const found = readBooksResponse.data.find(
          (b) => b.open_library_id === openLibraryId
        );
        if (found) {
          setBook(found);
          bookId = found.id;
        }
      }
    }

    // Check if user has marked it as read
    const readBooksResponse = await apiClient.getUserReadBooks();
    if (readBooksResponse.data) {
      const found = readBooksResponse.data.find(
        (b) => b.open_library_id === openLibraryId
      );
      setIsRead(!!found);
    }

    // Check for existing diary entry and rating if we have a book ID
    if (bookId) {
      const [diaryResponse, ratingResponse] = await Promise.all([
        apiClient.getDiaryEntry(bookId).catch(() => ({ data: null })),
        apiClient.getRating(bookId).catch(() => ({ data: null })),
      ]);

      if (diaryResponse.data) {
        setExistingDiaryEntry(diaryResponse.data);
        setDiaryEntry(diaryResponse.data.entry_text);
      }

      if (ratingResponse.data) {
        setExistingRating(ratingResponse.data);
        setRating(ratingResponse.data.rating);
      }
    }

    setLoading(false);
  };

  const handleMarkAsRead = async () => {
    if (!book) {
      // If book not in DB yet, add it first
      const addResponse = await apiClient.addBook(openLibraryId);
      if (addResponse.data) {
        const bookResponse = await apiClient.getBook(addResponse.data.book_id);
        if (bookResponse.data) {
          setBook(bookResponse.data);
          const markResponse = await apiClient.markBookAsRead(bookResponse.data.id);
          if (markResponse.data) {
            setIsRead(true);
          }
        }
      }
      return;
    }
    setSaving(true);
    const response = await apiClient.markBookAsRead(book.id);
    if (response.data) {
      setIsRead(true);
    }
    setSaving(false);
  };

  const handleSaveDiaryEntry = async () => {
    let currentBook = book;
    if (!currentBook) {
      // Add book to DB first if needed
      const addResponse = await apiClient.addBook(openLibraryId);
      if (addResponse.data) {
        const bookResponse = await apiClient.getBook(addResponse.data.book_id);
        if (bookResponse.data) {
          setBook(bookResponse.data);
          currentBook = bookResponse.data;
        } else {
          setError('Could not save diary entry. Please try again.');
          return;
        }
      } else {
        setError('Could not save diary entry. Please try again.');
        return;
      }
    }
    
    setSaving(true);
    let response;
    if (existingDiaryEntry) {
      response = await apiClient.updateDiaryEntry(existingDiaryEntry.id, diaryEntry);
    } else {
      response = await apiClient.createDiaryEntry(currentBook.id, diaryEntry);
    }
    if (response.data) {
      setExistingDiaryEntry(response.data);
    } else {
      setError(response.error || 'Could not save diary entry.');
    }
    setSaving(false);
  };

  const handleSaveRating = async (newRating: number) => {
    let currentBook = book;
    if (!currentBook) {
      // Add book to DB first if needed
      const addResponse = await apiClient.addBook(openLibraryId);
      if (addResponse.data) {
        const bookResponse = await apiClient.getBook(addResponse.data.book_id);
        if (bookResponse.data) {
          setBook(bookResponse.data);
          currentBook = bookResponse.data;
        } else {
          setError('Could not save rating. Please try again.');
          return;
        }
      } else {
        setError('Could not save rating. Please try again.');
        return;
      }
    }
    
    setRating(newRating);
    setSaving(true);
    const response = await apiClient.createOrUpdateRating(currentBook.id, newRating);
    if (response.data) {
      setExistingRating(response.data);
    } else {
      setError(response.error || 'Could not save rating.');
    }
    setSaving(false);
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
        Loading book details...
      </div>
    );
  }

  const displayBook = book || searchResult;
  if (!displayBook) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: colors.error }}>Book not found</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <button
        onClick={() => router.back()}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: colors.mediumBrown,
          cursor: 'pointer',
          marginBottom: '1rem',
          fontSize: '0.9rem',
        }}
      >
        ← Back
      </button>

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

      {!book && searchResult && (
        <div style={{
          backgroundColor: colors.warmCream,
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          color: colors.textSecondary,
          fontSize: '0.9rem',
        }}>
          Note: This book will be added to your library when you interact with it (rate, add diary entry, or mark as read).
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '2rem',
        marginBottom: '2rem',
      }}>
        {displayBook.cover_image_url && (
          <img
            src={displayBook.cover_image_url}
            alt={displayBook.title}
            style={{
              width: '200px',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
        )}
        <div>
          <h1 style={{
            color: colors.textPrimary,
            marginBottom: '0.5rem',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}>
            {displayBook.title}
          </h1>
          <p style={{
            color: colors.textSecondary,
            marginBottom: '1rem',
            fontSize: '1.1rem',
          }}>
            {displayBook.author || 'Unknown Author'}
          </p>
          {displayBook.published_year && (
            <p style={{
              color: colors.textLight,
              marginBottom: '1rem',
            }}>
              Published: {displayBook.published_year}
            </p>
          )}
          {displayBook.description && (
            <p style={{
              color: colors.textSecondary,
              lineHeight: '1.6',
              marginBottom: '1rem',
            }}>
              {displayBook.description}
            </p>
          )}
        </div>
      </div>

      <div style={{
        backgroundColor: colors.white,
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        border: `1px solid ${colors.border}`,
      }}>
        <h2 style={{
          color: colors.textPrimary,
          marginBottom: '1rem',
          fontSize: '1.3rem',
        }}>
          Rate this book
        </h2>
        <StarRating
          rating={rating || 0}
          onRatingChange={handleSaveRating}
          size={32}
        />
        {existingRating && (
          <p style={{
            color: colors.textLight,
            fontSize: '0.9rem',
            marginTop: '0.5rem',
          }}>
            Your rating: {existingRating.rating} stars
          </p>
        )}
      </div>

      <div style={{
        backgroundColor: colors.white,
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        border: `1px solid ${colors.border}`,
      }}>
        <h2 style={{
          color: colors.textPrimary,
          marginBottom: '1rem',
          fontSize: '1.3rem',
        }}>
          Diary Entry
        </h2>
        <textarea
          value={diaryEntry}
          onChange={(e) => setDiaryEntry(e.target.value)}
          placeholder="Write your thoughts about this book..."
          style={{
            width: '100%',
            minHeight: '150px',
            padding: '0.75rem',
            border: `1px solid ${colors.border}`,
            borderRadius: '4px',
            fontSize: '1rem',
            color: colors.textPrimary,
            backgroundColor: colors.white,
            fontFamily: 'inherit',
            resize: 'vertical',
            marginBottom: '1rem',
          }}
        />
        <button
          onClick={handleSaveDiaryEntry}
          disabled={saving}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: colors.mediumBrown,
            color: colors.white,
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving...' : existingDiaryEntry ? 'Update Entry' : 'Save Entry'}
        </button>
      </div>

      <div style={{
        backgroundColor: colors.white,
        padding: '1.5rem',
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
      }}>
        <button
          onClick={handleMarkAsRead}
          disabled={isRead || saving}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: isRead ? colors.border : colors.lightBrown,
            color: isRead ? colors.textSecondary : colors.textPrimary,
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isRead ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {isRead ? '✓ Marked as Read' : 'Mark as Read'}
        </button>
      </div>
    </div>
  );
}

