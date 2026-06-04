import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark';

export function useThemePreference(): [Theme, () => void] {
  const getInitial = (): Theme => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) return stored;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme])

      useEffect(() => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  console.log('html classes:', root.className); // 👈
  localStorage.setItem('theme', theme);
  console.log(localStorage.getItem('theme'));
}, [theme])

  const toggle = () => setTheme(theme => (theme === 'dark' ? 'light' : 'dark'));

  return [theme, toggle];
}