import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import Router, { ROUTES } from 'Router';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import manifest from '../manifest.json';

// @ts-ignore title parameter is required for compatibility
navigator.registerProtocolHandler("web+davidhomeventory", manifest.start_url.replace(/\/$/, '') + ROUTES.OPEN_ITEM("%s"), "HomeVentory")

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
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
