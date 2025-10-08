import { CgDarkMode } from "react-icons/cg";
import { Button } from './button'
import { useTheme } from '../../contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="hover:bg-accent transition-colors"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <CgDarkMode className="h-6 w-6 text-muted-foreground" />
    </div>
  )
}
