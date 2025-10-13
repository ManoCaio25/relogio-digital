export const PAGE_URLS = {
  Dashboard: '/',
  Interns: '/interns',
  ContentManagement: '/content',
  AscendaIABase: '/ascenda-ia',
  AscendaIA: '/ascenda-ia/generator',
  AscendaIAAssign: '/ascenda-ia/assign',
  AscendaIALibrary: '/ascenda-ia/library',
  VacationRequests: '/vacation-requests',
  Reports: '/reports',
};

export function createPageUrl(pageName) {
  return PAGE_URLS[pageName] ?? '/';
}

export function cn(...values) {
  return values.filter(Boolean).join(' ');
}

