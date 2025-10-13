import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';
import './i18n';
import AppRouter from './app/router';
import Toasts from './components/common/Toasts';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toasts />
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);
