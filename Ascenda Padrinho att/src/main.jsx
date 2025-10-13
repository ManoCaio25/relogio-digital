import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/ascenda-quiz-scope.css';
import 'flag-icons/css/flag-icons.min.css';
import { LanguageProvider } from './i18n';
import { ToastProvider } from './components/feedback/Toaster';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </LanguageProvider>
  </React.StrictMode>
);

