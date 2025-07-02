import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { LocaleProvider } from './contexts/LocaleContext.tsx';
import store from './store/index.ts';

import './index.css'
import { Provider } from 'react-redux';
import Metadata from './components/metadata.tsx';
// import VoteButton from './components/button/VoteButton.tsx';
// import ThreadInput from './components/threads/ThreadInput.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Metadata title='Forum | Home' description='Forum | Home' />
    <ThemeProvider value={localStorage.getItem('theme') || 'light'}>
      <LocaleProvider value={localStorage.getItem('locale') || 'id'}>
        <StrictMode>
          <Provider store={store}>
            {/* <ThreadInput /> */}
            <App />
          </Provider>
        </StrictMode>
      </LocaleProvider>
    </ThemeProvider>
  </BrowserRouter>
);
