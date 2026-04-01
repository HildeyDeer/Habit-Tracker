import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

export const ThemeToggle = () => {
  const { toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg 
        bg-gray-100 dark:bg-dark-surface2 
        hover:bg-gray-200 dark:hover:bg-dark-border 
        transition-all duration-200"
      aria-label="Toggle theme"
    >
      <Sun 
        className="w-5 h-5 text-amber-500 transition-all duration-300 absolute
          [transform:rotate(0deg)_scale(1)] 
          dark:[transform:rotate(90deg)_scale(0)] 
          dark:opacity-0"
      />
      <Moon 
        className="w-5 h-5 text-slate-600 transition-all duration-300 absolute
          [transform:rotate(-90deg)_scale(0)] 
          dark:[transform:rotate(0deg)_scale(1)]
          dark:opacity-100 dark:text-slate-300"
      />
    </button>
  );
};
