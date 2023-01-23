import { createRoot } from 'react-dom/client';
import { StrictMode, useEffect } from 'react';
import Router, { ROUTES } from 'Router';
import { HashRouter, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { App, URLOpenListenerEvent } from '@capacitor/app';

const AppUrlListener: React.FC<any> = () => {
  let navigate = useNavigate();
  useEffect(() => {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      const itemId = event.url.split('://').pop();
      if (itemId) {
        navigate(ROUTES.OPEN_ITEM(itemId));
      }
    });
  }, []);

  return null;
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const element = document.getElementById('root');
if (!element) throw new Error('could not found the root element');
const root = createRoot(element);
root.render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <HashRouter>
        <AppUrlListener />
        <Router />
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
);
