export type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';

export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === 'dark' || stored === 'light' ? stored : null;
}

export function getPreferredTheme(): Theme {
  const stored = getStoredTheme();
  if (stored) return stored;
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  try { window.localStorage.setItem(THEME_KEY, theme); } catch {}
}

export function initTheme() {
  applyTheme(getPreferredTheme());
}

export function getCurrentTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  const root = document.documentElement;
  const dataTheme = root.getAttribute('data-theme') as Theme;
  if (dataTheme) return dataTheme;
  return root.classList.contains('dark') ? 'dark' : 'light';
}

export function toggleTheme(): Theme {
  const currentTheme = getCurrentTheme();
  const nextTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  return nextTheme;
}


