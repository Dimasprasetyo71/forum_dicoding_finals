import PropTypes from 'prop-types';
import { createContext, useState } from 'react';
import type { LocaleProviderProps, LocaleContextType } from '../types';

const LocaleContext = createContext<LocaleContextType>({
  locale: 'id',
  toggleLocale: () => { },
});


export function LocaleProvider({ children, value }: LocaleProviderProps) {

  const [locale, setLocale] = useState<string>(value || localStorage.getItem('locale') || 'id');

  const toggleLocale = () => {
    setLocale((prevLocale) => {
      const newLocale = prevLocale === 'id' ? 'en' : 'id';
      localStorage.setItem('locale', newLocale);
      return newLocale;
    });
  };

  const contextValue = {
    locale,
    toggleLocale,
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

LocaleProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string,
};

export default LocaleContext;
