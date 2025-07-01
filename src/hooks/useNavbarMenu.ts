import { useContext } from 'react';
import { ENDPOINT } from '../route/Path';
import LocaleContext from '../contexts/LocaleContext';
import RegisterPage from '../pages/RegisterPages';

export function useNavbarMenu() {
  const { locale } = useContext(LocaleContext);

  return [
    {
      title: locale === 'id' ? 'Beranda' : 'Home',
      link: ENDPOINT.HOME,
      key: 'h',
    },
    {
      title: locale === 'id' ? 'Login' : 'Login',
      link: ENDPOINT.LOGIN,
      key: 'l',
    },
    {
      title: locale === 'id' ? 'Daftar' : 'Register',
      link: ENDPOINT.REGISTER,
      key: 'r',
      href: RegisterPage,
    },
  ] as const;
}
