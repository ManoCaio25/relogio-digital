import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Interns from './pages/Interns.jsx';
import ContentManagement from './pages/ContentManagement.jsx';
import VacationRequests from './pages/VacationRequests.jsx';
import Reports from './pages/Reports.jsx';
import { PAGE_URLS } from './utils/index.js';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path={PAGE_URLS.Dashboard} element={<Dashboard />} />
          <Route path={PAGE_URLS.Interns} element={<Interns />} />
          <Route path={PAGE_URLS.ContentManagement} element={<ContentManagement />} />
          <Route path={PAGE_URLS.VacationRequests} element={<VacationRequests />} />
          <Route path={PAGE_URLS.Reports} element={<Reports />} />
          <Route path="*" element={<Navigate to={PAGE_URLS.Dashboard} replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

