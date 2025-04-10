import { ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import './index.css';
import theme from './theme';
import { ErrorProvider } from './contexts/ErrorContext.tsx';
import { UserProvider } from './contexts/UserContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <ErrorProvider>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </ErrorProvider>
    </UserProvider>
  </StrictMode>,
)
