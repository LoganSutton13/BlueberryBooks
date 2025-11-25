'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme';
import { useState, useRef, useEffect } from 'react';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isAuthenticated) {
    return null;
  }

  const handleMenuClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav style={{
      backgroundColor: colors.white,
      borderBottom: `1px solid ${colors.border}`,
      padding: '0.75rem 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <Link href="/dashboard" style={{
        color: colors.textPrimary,
        textDecoration: 'none',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        BlueberryBooks
      </Link>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Dropdown Menu Button */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={handleMenuClick}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary,
              padding: '0.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.textPrimary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              right: 0,
              backgroundColor: colors.white,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              minWidth: '180px',
              zIndex: 1000,
              overflow: 'hidden',
            }}>
              <Link
                href="/search"
                onClick={handleMenuItemClick}
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  color: colors.textPrimary,
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  borderBottom: `1px solid ${colors.borderLight}`,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Search Books
              </Link>
              <Link
                href="/users/search"
                onClick={handleMenuItemClick}
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  color: colors.textPrimary,
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  borderBottom: `1px solid ${colors.borderLight}`,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Find Users
              </Link>
              <Link
                href="/dashboard"
                onClick={handleMenuItemClick}
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  color: colors.textPrimary,
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  borderBottom: `1px solid ${colors.borderLight}`,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: colors.error,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Profile Icon */}
        <Link
          href="/profile"
          style={{
            color: colors.textPrimary,
            textDecoration: 'none',
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.backgroundSecondary,
            transition: 'background-color 0.2s, transform 0.2s',
            flexShrink: 0,
          }}
          title={`${user?.username}'s Profile`}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.warmBeige;
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          👤
        </Link>
      </div>
    </nav>
  );
}

