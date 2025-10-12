export const PAGE_URLS = {
  Dashboard: '/',
  Interns: '/interns',
  ContentManagement: '/content',
  AscendaIA: '/ascenda/ai-quizzes',
  VacationRequests: '/vacation-requests',
  Reports: '/reports',
};

export function createPageUrl(pageName) {
  return PAGE_URLS[pageName] ?? '/';
}

export function cn(...values) {
  return values.filter(Boolean).join(' ');
}

