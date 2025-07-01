import { useContext } from 'react';
import { FlagIcon } from './FlagIcon';
import LocaleContext from '../../contexts/LocaleContext';

const LocaleToggle = () => {
  const { locale, toggleLocale } = useContext(LocaleContext);

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300"
      aria-label={`Switch to ${locale === 'id' ? 'English' : 'Bahasa Indonesia'}`}
    >
      <FlagIcon code={locale === 'id' ? 'ID' : 'GB'} />
      <span className="font-medium">
        {locale === 'id' ? 'ID' : 'EN'}
      </span>
    </button>
  );
};

export default LocaleToggle;