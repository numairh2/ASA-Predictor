'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <button
        className="min-h-[44px] min-w-[44px] p-2 rounded-sm border-2 border-tan-300 dark:border-slate-600 bg-white dark:bg-slate-800"
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="min-h-[44px] min-w-[44px] p-2 rounded-sm border-2 border-tan-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-brown-800 dark:text-slate-100 hover:bg-cream-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={20} />
      ) : (
        <Sun size={20} />
      )}
    </button>
  )
}
