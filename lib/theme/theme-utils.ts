/**
 * Theme Utilities
 *
 * Helper functions for working with themes, generating CSS variables,
 * and applying theme configurations.
 */

import type { ThemeConfig } from '@/config/theme.config';

/**
 * Convert theme config to CSS custom properties
 */
export function themeToCSSVariables(theme: ThemeConfig): Record<string, string> {
  const cssVars: Record<string, string> = {};

  // Colors
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    cssVars[`--color-primary-${key}`] = value;
  });

  Object.entries(theme.colors.secondary).forEach(([key, value]) => {
    cssVars[`--color-secondary-${key}`] = value;
  });

  Object.entries(theme.colors.neutral).forEach(([key, value]) => {
    cssVars[`--color-neutral-${key}`] = value;
  });

  // Semantic colors
  cssVars['--color-success'] = theme.colors.success;
  cssVars['--color-warning'] = theme.colors.warning;
  cssVars['--color-error'] = theme.colors.error;
  cssVars['--color-info'] = theme.colors.info;

  // Background colors
  cssVars['--color-background'] = theme.colors.background;
  cssVars['--color-foreground'] = theme.colors.foreground;
  cssVars['--color-muted'] = theme.colors.muted;
  cssVars['--color-muted-foreground'] = theme.colors.mutedForeground;

  // UI colors
  cssVars['--color-border'] = theme.colors.border;
  cssVars['--color-input'] = theme.colors.input;
  cssVars['--color-ring'] = theme.colors.ring;

  // Card colors
  cssVars['--color-card'] = theme.colors.card;
  cssVars['--color-card-foreground'] = theme.colors.cardForeground;

  // Typography
  cssVars['--font-sans'] = theme.typography.fontFamily.sans.join(', ');
  cssVars['--font-serif'] = theme.typography.fontFamily.serif.join(', ');
  cssVars['--font-mono'] = theme.typography.fontFamily.mono.join(', ');
  cssVars['--font-heading'] = theme.typography.fontFamily.heading.join(', ');

  // Font sizes
  Object.entries(theme.typography.fontSize).forEach(([key, [size, config]]) => {
    cssVars[`--font-size-${key}`] = size;
    cssVars[`--line-height-${key}`] = config.lineHeight;
    if (config.letterSpacing) {
      cssVars[`--letter-spacing-${key}`] = config.letterSpacing;
    }
  });

  // Spacing
  cssVars['--container-max-width'] = theme.spacing.container.maxWidth;
  cssVars['--container-padding-mobile'] = theme.spacing.container.padding.mobile;
  cssVars['--container-padding-tablet'] = theme.spacing.container.padding.tablet;
  cssVars['--container-padding-desktop'] = theme.spacing.container.padding.desktop;

  cssVars['--section-padding-y-mobile'] = theme.spacing.section.paddingY.mobile;
  cssVars['--section-padding-y-tablet'] = theme.spacing.section.paddingY.tablet;
  cssVars['--section-padding-y-desktop'] = theme.spacing.section.paddingY.desktop;

  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value;
  });

  // Effects
  Object.entries(theme.effects.shadow).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value;
  });

  Object.entries(theme.effects.transition).forEach(([key, value]) => {
    cssVars[`--transition-${key}`] = value;
  });

  return cssVars;
}

/**
 * Generate CSS string from theme
 */
export function generateThemeCSS(theme: ThemeConfig, selector: string = ':root'): string {
  const cssVars = themeToCSSVariables(theme);

  const lines = Object.entries(cssVars).map(
    ([key, value]) => `  ${key}: ${value};`
  );

  return `${selector} {\n${lines.join('\n')}\n}`;
}

/**
 * Generate dark mode variants
 */
export function generateDarkModeCSS(theme: ThemeConfig): string {
  const darkColors = {
    '--color-background': theme.colors.neutral[950],
    '--color-foreground': theme.colors.neutral[50],
    '--color-muted': theme.colors.neutral[900],
    '--color-muted-foreground': theme.colors.neutral[400],
    '--color-border': theme.colors.neutral[800],
    '--color-input': theme.colors.neutral[800],
    '--color-card': theme.colors.neutral[900],
    '--color-card-foreground': theme.colors.neutral[50],
  };

  const lines = Object.entries(darkColors).map(
    ([key, value]) => `  ${key}: ${value};`
  );

  return `.dark {\n${lines.join('\n')}\n}`;
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: ThemeConfig): void {
  if (typeof document === 'undefined') return;

  const cssVars = themeToCSSVariables(theme);

  Object.entries(cssVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

/**
 * Load Google Fonts dynamically
 */
export function loadGoogleFonts(fontFamilies: string[]): void {
  if (typeof document === 'undefined') return;

  // Remove existing Google Fonts link
  const existingLink = document.getElementById('google-fonts');
  if (existingLink) {
    existingLink.remove();
  }

  // Create new link
  const fontParams = fontFamilies
    .map((font) => {
      // Convert font name to Google Fonts format
      const fontName = font.replace(/\s+/g, '+');
      return `family=${fontName}:wght@300;400;500;600;700;800;900`;
    })
    .join('&');

  const link = document.createElement('link');
  link.id = 'google-fonts';
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
  document.head.appendChild(link);
}

/**
 * Get all unique fonts from theme
 */
export function getThemeFonts(theme: ThemeConfig): string[] {
  const fonts = new Set<string>();

  Object.values(theme.typography.fontFamily).forEach((family) => {
    family.forEach((font) => {
      // Only add non-system fonts
      if (
        !font.includes('system') &&
        !font.includes('serif') &&
        !font.includes('sans-serif') &&
        !font.includes('monospace')
      ) {
        fonts.add(font);
      }
    });
  });

  return Array.from(fonts);
}

/**
 * Validate hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Convert hex to RGB
 */
export function hexToRGB(hex: string): { r: number; g: number; b: number } | null {
  if (!isValidHexColor(hex)) return null;

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate color contrast ratio (WCAG)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRGB(color1);
  const rgb2 = hexToRGB(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Calculate relative luminance
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const srgb = c / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Check if color combination meets WCAG AA standard
 */
export function meetsWCAGAA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 4.5; // WCAG AA for normal text
}

/**
 * Check if color combination meets WCAG AAA standard
 */
export function meetsWCAGAAA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio >= 7; // WCAG AAA for normal text
}

/**
 * Export theme as JSON
 */
export function exportTheme(theme: ThemeConfig): string {
  return JSON.stringify(theme, null, 2);
}

/**
 * Import theme from JSON
 */
export function importTheme(json: string): ThemeConfig | null {
  try {
    return JSON.parse(json) as ThemeConfig;
  } catch {
    return null;
  }
}
