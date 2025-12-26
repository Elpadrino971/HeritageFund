import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-border dark:hover:bg-dark-border transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-light-text dark:text-dark-text" />
      ) : (
        <Sun className="h-5 w-5 text-light-text dark:text-dark-text" />
      )}
    </button>
  )
}
