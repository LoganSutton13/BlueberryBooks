'use client';

import React, { useState } from 'react';
import { colors } from '@/theme';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  onRatingClear?: () => void;
  readonly?: boolean;
  size?: number;
  allowClear?: boolean;
}

export function StarRating({
  rating,
  onRatingChange,
  onRatingClear,
  readonly = false,
  size = 24,
  allowClear = false,
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleClick = (value: number) => {
    if (readonly) {
      return;
    }

    if (allowClear && value === rating) {
      onRatingClear?.();
      return;
    }

    onRatingChange?.(value);
  };

  const displayRating = hoveredRating ?? rating;

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          onMouseEnter={() => !readonly && setHoveredRating(value)}
          onMouseLeave={() => !readonly && setHoveredRating(null)}
          disabled={readonly}
          style={{
            background: 'none',
            border: 'none',
            cursor: readonly ? 'default' : 'pointer',
            padding: 0,
            fontSize: `${size}px`,
            color: value <= displayRating ? colors.mediumBrown : colors.border,
            transition: 'color 0.2s',
          }}
          aria-label={`Rate ${value} out of 5`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

