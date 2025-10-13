import { MOCK_GENERATED_QUIZZES } from '../mocks/quizzes.mock';
import { useQuizzesStore } from '../stores/useQuizzesStore';

const simulateDelay = (result, delay = 240) =>
  new Promise((resolve) => setTimeout(() => resolve(result), delay));

const getStore = () => useQuizzesStore.getState();

export const QuizService = {
  async listGenerated() {
    return simulateDelay(MOCK_GENERATED_QUIZZES);
  },

  async listTemplates() {
    return simulateDelay(getStore().templates);
  },

  async createTemplate(payload) {
    const template = getStore().addTemplateFromGenerator(payload);
    return simulateDelay(template);
  },

  async updateTemplate(id, patch) {
    const template = getStore().updateTemplate(id, patch);
    return simulateDelay(template);
  },

  async duplicateTemplate(id) {
    const template = getStore().duplicateTemplate(id);
    return simulateDelay(template);
  },

  async archiveTemplate(id, flag = true) {
    const template = getStore().archiveTemplate(id, flag);
    return simulateDelay(template);
  },

  async assignFromTemplate(templateId, payload) {
    try {
      const assignment = getStore().assignFromTemplate(templateId, payload);
      return simulateDelay({ success: true, assignmentIds: [assignment.id] });
    } catch (error) {
      console.error('assignFromTemplate failed', error);
      return simulateDelay({ success: false, message: error.message ?? 'assignment failed' });
    }
  },

  async listInbox(userId) {
    const inbox = getStore().inboxByUser[userId] ?? [];
    return simulateDelay(inbox);
  },

  async markDone(userId, quizId) {
    const quiz = getStore().markQuizDone(userId, quizId);
    return simulateDelay({ success: Boolean(quiz), quiz });
  },
};
