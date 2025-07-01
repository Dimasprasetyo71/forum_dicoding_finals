import { Link, useLocation } from 'react-router-dom';
import NavbarListener from './navbar-listener';
import { useNavbarMenu } from '../../hooks/useNavbarMenu';
import { useState, useEffect } from 'react';
import LocaleToggle from '../toggle/LocaleToggle';
import ThemeToggle from '../toggle/ThemeToggle';

function getHighlightedParts(title: string, key: string) {
  const index = title.toLowerCase().indexOf(key.toLowerCase());
  if (index === -1) return { before: title, highlighted: null, after: null };

  return {
    before: title.slice(0, index),
    highlighted: title[index],
    after: title.slice(index + 1),
  };
}

function isActive(href: string, currentPath: string) {
  if (currentPath === href) return true;
  if (href !== '/' && currentPath.startsWith(`${href  }/`)) return true;
  return false;
}

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const menu = useNavbarMenu();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location, isMobile]);

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50 dark:bg-white">
      <NavbarListener />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-white">
                            Brand
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-10">
            <div className="flex items-center space-x-6">
              {menu.map(({ title, link, key }) => {
                const parts = getHighlightedParts(title, key);
                const active = isActive(link, currentPath);
                return (
                  <Link

                    key={key}
                    to={link}

                    className={`text-base font-medium transition-all duration-200 ${active
                      ? 'text-indigo-400'
                      : 'text-indigo-300 hover:text-indigo-200 dark:text-indigo-200 dark:hover:text-indigo-100'
                    }`}
                    aria-label={`${title} (Shortcut: ${key})`}
                  >
                    {parts.before}
                    {parts.highlighted && (
                      <span className="underline underline-offset-2">
                        {parts.highlighted}
                      </span>
                    )}
                    {parts.after}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Action Buttons */}
            <div className="flex items-center space-x-3">
              <LocaleToggle />
              <ThemeToggle />
              <a
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-2 rounded-md transition-all duration-200 text-sm"
                href="https://github.com/Dimasprasetyo71"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                                D
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {menu.map(({ title, link, key }) => {
            const active = isActive(link, currentPath);
            return (
              <Link
                key={key}
                to={link}
                className={`${active
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                {title}
              </Link>
            );
          })}
          <div className="mt-4 flex flex-col space-y-2 px-3">
            <a
              className="w-full text-center flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md transition-all duration-200"
              href="https://github.com/Dimasprasetyo71"
              target="_blank"
              rel="noreferrer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Dimas Prasetyo
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}