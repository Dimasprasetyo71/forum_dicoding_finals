import PropTypes from 'prop-types';
import { createContext, useState } from 'react';
import type { ThemeProviderProps, ThemeContextType } from '../types';


const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => { },
});

export function ThemeProvider({ children, value }: ThemeProviderProps) {
  const [theme, setTheme] = useState<string>(
    value || localStorage.getItem('theme') || 'light'
  );

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string,
};

export default ThemeContext;
