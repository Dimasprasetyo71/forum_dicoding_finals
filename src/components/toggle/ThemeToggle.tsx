import { useContext, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import  ThemeContext  from '../../contexts/ThemeContext';


const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isHovered, setIsHovered] = useState(false);

  const getContainerClass = () => {
    const baseClass = 'flex items-center gap-3 px-5 py-2 rounded-full transition-all duration-300 text-white';

    if (theme === 'light') {
      return `${baseClass} bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-200`;
    } else {
      return `${baseClass} bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-200/40`;
    }
  };

  const getIconClass = () => {
    return `transition-transform duration-300 ${  isHovered ? 'scale-110' : ''}`;
  };

  return (
    <button
      onClick={toggleTheme}
      className={getContainerClass()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className={getIconClass()}>
        {theme === 'light' ? (
          <Moon className="w-6 h-6" strokeWidth={2} />
        ) : (
          <Sun className="w-6 h-6" strokeWidth={2} />
        )}
      </div>

      <span className="font-medium text-sm tracking-wide whitespace-nowrap">
        {theme === 'light' ? 'Go Dark' : 'Go Light'}
      </span>
    </button>
  );
};

export default ThemeToggle;