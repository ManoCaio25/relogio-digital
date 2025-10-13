import { useLibraryStore } from '../state/useLibraryStore';

export const libraryService = {
  list(filters = {}) {
    const templates = useLibraryStore.getState().templates;
    return templates.filter((template) => {
      if (filters.archived === false && template.archived) return false;
      if (filters.archived === true && !template.archived) return false;
      if (filters.search) {
        const term = filters.search.toLowerCase();
        if (!template.title.toLowerCase().includes(term) && !template.description.toLowerCase().includes(term)) {
          return false;
        }
      }
      if (filters.tag && filters.tag.length) {
        return filters.tag.every((tag) => template.tags.includes(tag));
      }
      return true;
    });
  },
  update(id, patch) {
    useLibraryStore.getState().updateTemplate(id, patch);
  },
  duplicate(id) {
    return useLibraryStore.getState().duplicateTemplate(id);
  },
  archive(id, flag) {
    useLibraryStore.getState().archiveTemplate(id, flag);
  }
};
