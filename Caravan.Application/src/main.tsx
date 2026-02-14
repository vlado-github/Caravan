import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import App from './App.tsx'
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <ErrorBoundary>
        <Notifications position='top-right' />
        <App />
      </ErrorBoundary>
    </MantineProvider>
  </StrictMode>
)
