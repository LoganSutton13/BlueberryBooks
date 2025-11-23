/**
 * Color theme for BlueberryBooks
 * Simple white background with warm inviting colors (light brown) and black text
 */

export const colors = {
  // Primary colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Warm brown tones
  lightBrown: '#D4A574',
  mediumBrown: '#8B6F47',
  darkBrown: '#5C4A2E',
  
  // Accent colors
  warmBeige: '#F5E6D3',
  warmCream: '#FAF5EF',
  
  // Text colors
  textPrimary: '#000000',
  textSecondary: '#333333',
  textLight: '#666666',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#FAF5EF',
  
  // Border colors
  border: '#E8DCC8',
  borderLight: '#F5E6D3',
  
  // Status colors
  success: '#4A7C59',
  error: '#C85A5A',
  warning: '#D4A574',
};

export type ColorTheme = typeof colors;

