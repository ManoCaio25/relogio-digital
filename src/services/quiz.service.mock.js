import { useLibraryStore } from '../state/useLibraryStore';
import { useQuizzesStore } from '../state/useQuizzesStore';

export const quizService = {
  async generate(prompt) {
    const title = `Quiz - ${prompt.slice(0, 32)}`;
    const template = useLibraryStore.getState().addTemplateFromGenerator({
      title,
      description: `Quiz gerado automaticamente para ${prompt}.`,
      tags: prompt.split(' ').filter(Boolean).slice(0, 3),
      difficulty: 'Médio',
      content: `Perguntas inteligentes sobre ${prompt}.`
    });
    return template;
  },
  listInbox(userId) {
    return useQuizzesStore.getState().listInbox(userId);
  },
  markDone(userId, quizId) {
    useQuizzesStore.getState().markDone(userId, quizId);
  }
};
