'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { apiClient, UserProfileWithBooks, TopRatedBook } from '@/lib/api';
import { colors } from '@/theme';
import { StarRating } from '@/components/StarRating';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function UserProfilePage() {
  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
        <Navbar />
        <UserProfileContent />
      </div>
    </ProtectedRoute>
  );
}

function UserProfileContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const userId = parseInt(params.id as string);
  const [profile, setProfile] = useState<UserProfileWithBooks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [following, setFollowing] = useState(false);
  const [updatingFollow, setUpdatingFollow] = useState(false);

  useEffect(() => {
    if (isNaN(userId)) {
      setError('Invalid user ID');
      setLoading(false);
      return;
    }
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    const response = await apiClient.getUserProfile(userId);
    
    if (response.data) {
      setProfile(response.data);
      setFollowing(response.data.is_following);
    } else {
      setError(response.error || 'Failed to load profile');
    }
    setLoading(false);
  };

  const handleFollow = async () => {
    if (updatingFollow) return;
    
    setUpdatingFollow(true);
    const response = following
      ? await apiClient.unfollowUser(userId)
      : await apiClient.followUser(userId);
    
    if (response.data) {
      setFollowing(!following);
      // Reload profile to update counts
      await loadProfile();
    }
    setUpdatingFollow(false);
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
        Loading profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: colors.warmBeige,
          color: colors.error,
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          {error || 'Profile not found'}
        </div>
      </div>
    );
  }

  if (!profile.can_view) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: colors.white,
          padding: '3rem',
          borderRadius: '8px',
          border: `1px solid ${colors.border}`,
          textAlign: 'center',
        }}>
          <h2 style={{
            color: colors.textPrimary,
            marginBottom: '1rem',
            fontSize: '1.5rem',
          }}>
            Private Profile
          </h2>
          <p style={{
            color: colors.textSecondary,
            marginBottom: '2rem',
          }}>
            This profile is private. Follow {profile.username} to view their profile.
          </p>
          {!following && (
            <button
              onClick={handleFollow}
              disabled={updatingFollow}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: colors.mediumBrown,
                color: colors.white,
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: updatingFollow ? 'not-allowed' : 'pointer',
                opacity: updatingFollow ? 0.6 : 1,
              }}
            >
              {updatingFollow ? 'Following...' : 'Follow'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: colors.white,
        padding: '2rem',
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
        marginBottom: '2rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
        }}>
          <div>
            <h1 style={{
              color: colors.textPrimary,
              marginBottom: '0.5rem',
              fontSize: '2rem',
              fontWeight: 'bold',
            }}>
              {profile.username}
            </h1>
            {profile.is_friend && (
              <span style={{
                backgroundColor: colors.warmBeige,
                color: colors.mediumBrown,
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: '600',
              }}>
                Friend
              </span>
            )}
          </div>
          {user && profile.id !== user.id && (
            <button
              onClick={handleFollow}
              disabled={updatingFollow}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: following ? colors.warmBeige : colors.mediumBrown,
                color: following ? colors.textPrimary : colors.white,
                border: following ? `1px solid ${colors.border}` : 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: updatingFollow ? 'not-allowed' : 'pointer',
                opacity: updatingFollow ? 0.6 : 1,
              }}
            >
              {updatingFollow ? 'Updating...' : following ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '2rem',
          color: colors.textSecondary,
        }}>
          <div>
            <span style={{ fontWeight: '600', color: colors.textPrimary }}>
              {profile.books_read_count}
            </span>
            <span style={{ marginLeft: '0.5rem' }}>Books Read</span>
          </div>
          <div>
            <span style={{ fontWeight: '600', color: colors.textPrimary }}>
              {profile.followers_count}
            </span>
            <span style={{ marginLeft: '0.5rem' }}>Followers</span>
          </div>
          <div>
            <span style={{ fontWeight: '600', color: colors.textPrimary }}>
              {profile.following_count}
            </span>
            <span style={{ marginLeft: '0.5rem' }}>Following</span>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{
          color: colors.textPrimary,
          marginBottom: '1.5rem',
          fontSize: '1.5rem',
          fontWeight: '600',
        }}>
          Top 10 Rated Books
        </h2>
        {profile.top_rated_books.length === 0 ? (
          <div style={{
            backgroundColor: colors.white,
            padding: '3rem',
            borderRadius: '8px',
            textAlign: 'center',
            border: `1px solid ${colors.border}`,
          }}>
            <p style={{ color: colors.textSecondary }}>
              {profile.username} hasn't rated any books yet.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            {profile.top_rated_books.map((book) => (
              <TopRatedBookCard key={book.book_id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TopRatedBookCard({ book }: { book: TopRatedBook }) {
  return (
    <div style={{
      backgroundColor: colors.white,
      padding: '1.5rem',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      display: 'flex',
      gap: '1.5rem',
    }}>
      {book.cover_image_url && (
        <Link href={`/book/${book.open_library_id || book.book_id}`}>
          <img
            src={book.cover_image_url}
            alt={book.title}
            style={{
              width: '100px',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          />
        </Link>
      )}
      <div style={{ flex: 1 }}>
        <Link
          href={`/book/${book.open_library_id || book.book_id}`}
          style={{
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <h3 style={{
            color: colors.textPrimary,
            marginBottom: '0.5rem',
            fontSize: '1.2rem',
            fontWeight: '600',
          }}>
            {book.title}
          </h3>
        </Link>
        {book.author && (
          <p style={{
            color: colors.textSecondary,
            marginBottom: '0.75rem',
            fontSize: '0.95rem',
          }}>
            by {book.author}
          </p>
        )}
        <div style={{ marginBottom: '1rem' }}>
          <StarRating rating={book.rating} readonly size={20} />
        </div>
        {book.review && (
          <div style={{
            backgroundColor: colors.backgroundSecondary,
            padding: '1rem',
            borderRadius: '4px',
            marginTop: '1rem',
          }}>
            <p style={{
              color: colors.textPrimary,
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
            }}>
              {book.review}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

