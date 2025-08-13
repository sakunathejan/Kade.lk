import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initTheme } from './theme';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Add a visible runtime marker to confirm bundle runs
console.info('[TaproBuy] Client bundle loaded');

// Initialize theme before rendering
initTheme();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <App />
        </AppProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
