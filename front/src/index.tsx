import {createRoot} from 'react-dom/client';
import {StrictMode} from 'react';
import Router from 'Router';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
