'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { apiClient, UserProfile } from '@/lib/api';
import { colors } from '@/theme';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: colors.background }}>
        <Navbar />
        <ProfileContent />
      </div>
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    const response = await apiClient.getOwnProfile();
    
    if (response.data) {
      setProfile(response.data);
    } else {
      setError(response.error || 'Failed to load profile');
    }
    setLoading(false);
  };

  const handlePrivacyToggle = async () => {
    if (!profile || updating) return;
    
    setUpdating(true);
    const newPrivacy = !profile.is_private;
    const response = await apiClient.updatePrivacy(newPrivacy);
    
    if (response.data) {
      setProfile({ ...profile, is_private: response.data.is_private });
    } else {
      setError(response.error || 'Failed to update privacy setting');
    }
    setUpdating(false);
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

  if (error && !profile) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: colors.warmBeige,
          color: colors.error,
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          {error}
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{
        color: colors.textPrimary,
        marginBottom: '2rem',
        fontSize: '2rem',
        fontWeight: 'bold',
      }}>
        Profile Settings
      </h1>

      {error && (
        <div style={{
          backgroundColor: colors.warmBeige,
          color: colors.error,
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1.5rem',
        }}>
          {error}
        </div>
      )}

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
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
          <div>
            <h2 style={{
              color: colors.textPrimary,
              marginBottom: '0.5rem',
              fontSize: '1.3rem',
              fontWeight: '600',
            }}>
              {profile.username}
            </h2>
            <p style={{
              color: colors.textSecondary,
              fontSize: '0.9rem',
            }}>
              Profile Information
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '2rem',
          color: colors.textSecondary,
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${colors.border}`,
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

      <div style={{
        backgroundColor: colors.white,
        padding: '2rem',
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}>
          <div>
            <h2 style={{
              color: colors.textPrimary,
              marginBottom: '0.5rem',
              fontSize: '1.3rem',
              fontWeight: '600',
            }}>
              Privacy Settings
            </h2>
            <p style={{
              color: colors.textSecondary,
              fontSize: '0.9rem',
            }}>
              Control who can view your profile and top rated books
            </p>
          </div>
        </div>

        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${colors.border}`,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h3 style={{
                color: colors.textPrimary,
                marginBottom: '0.25rem',
                fontSize: '1rem',
                fontWeight: '600',
              }}>
                Private Profile
              </h3>
              <p style={{
                color: colors.textSecondary,
                fontSize: '0.85rem',
              }}>
                {profile.is_private
                  ? 'Only users you follow can view your profile and top rated books'
                  : 'Anyone can view your profile and top rated books'}
              </p>
            </div>
            <button
              onClick={handlePrivacyToggle}
              disabled={updating}
              style={{
                width: '50px',
                height: '28px',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: profile.is_private ? colors.mediumBrown : colors.border,
                position: 'relative',
                cursor: updating ? 'not-allowed' : 'pointer',
                opacity: updating ? 0.6 : 1,
                transition: 'background-color 0.2s',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: colors.white,
                  position: 'absolute',
                  top: '2px',
                  left: profile.is_private ? '24px' : '2px',
                  transition: 'left 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

