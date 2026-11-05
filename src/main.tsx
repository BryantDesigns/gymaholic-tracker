import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/big-shoulders-display';
import '@fontsource-variable/archivo';
import '@fontsource-variable/jetbrains-mono';
import './styles/base.css';
import './styles/layout.css';
import './styles/pages.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
