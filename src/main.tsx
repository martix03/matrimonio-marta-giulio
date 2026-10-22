import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SettingsProvider } from './contexts/SettingsContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

// Intercept asynchronous third-party library errors (like Google Maps unmount races)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('getRootNode')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      console.warn('Suppressed unhandled getRootNode error from map:', event.message);
      return true;
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </ErrorBoundary>
);
