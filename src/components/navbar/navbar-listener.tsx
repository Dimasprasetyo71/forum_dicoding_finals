import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavbarMenu } from '../../hooks/useNavbarMenu';

export default function NavbarListener() {

  const navigate = useNavigate();

  const menu = useNavbarMenu();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      const match = menu.find((item) => item.key === e.key.toLowerCase());
      if (match) navigate(match.link);
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [menu, navigate]);

  return null;
}
