import { useQuizzesStore } from '../state/useQuizzesStore';

export const assignService = {
  assignFromTemplate(templateId, payload) {
    return useQuizzesStore.getState().assignFromTemplate(templateId, payload);
  }
};
