import  { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LocaleContext from './contexts/LocaleContext';
import ThemeContext from './contexts/ThemeContext';
import  {asyncPreloadProcess}  from './features/ispreload/action';
import { asyncUnsetAuthUser } from './features/auth/action';
import { useAppSelector, useAppDispatch } from '../src/store/hooks';

// Pages
import HomePage from './pages/HomePages';
import LoginPage from './pages/LoginPages';
import RegisterPage from './pages/RegisterPages';
import DetailPage from './pages/Threads';
import AddThreadPage from './pages/AddThreadPages';
import LeaderboardsPage from './pages/LeaderboardPages';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Loading from './components/loading/Loading';
import Navigation from './components/navbar/fakenavbar';
import { ENDPOINT } from './route/Path';

function App() {
  const { theme } = useContext(ThemeContext);
  const { locale } = useContext(LocaleContext);
  const { isPreload = false, authUser } = useAppSelector((states: any) => states);
  const dispatch = useAppDispatch();

  // Theme & Locale Effects
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-locale', locale);
  }, [theme, locale]);

  // Preload user
  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  const onSignOut = () => {
    dispatch(asyncUnsetAuthUser());
  };

  if (isPreload) {
    return <Loading />;
  }

  if (authUser === null) {
    return (
      <>
        <Loading />
        <Routes>
          <Route path="/*" element={<LoginPage />} />
          <Route path={ENDPOINT.REGISTER} element={<RegisterPage />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Loading />
      <Navigation authUser={authUser} signOut={onSignOut} />
      <Routes>
        <Route path={ENDPOINT.HOME} element={<HomePage />} />
        <Route path="/new" element={<AddThreadPage />} />
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
        <Route path="/thread/:threadId" element={<DetailPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
