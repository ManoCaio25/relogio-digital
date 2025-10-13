import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid/non-secure';
import { createLocalForageStorage } from './createLocalForageStorage';
import { MOCK_QUIZZES } from '../mocks/quizzes.mock';
import { useLibraryStore } from './useLibraryStore';
import { useNotificationsStore } from './useNotificationsStore';

const BASE_MAP = Object.fromEntries(MOCK_QUIZZES.map((quiz) => [quiz.id, quiz]));

const buildInitialInbox = () => {
  const repeated = Object.keys(BASE_MAP);
  const total = 9;
  const interns = ['u2', 'u3', 'u4', 'u5', 'u6', 'u7'];
  return interns.reduce((acc, userId, idx) => {
    const items = Array.from({ length: total }).map((_, index) => {
      const quizId = repeated[(idx + index) % repeated.length];
      const quiz = BASE_MAP[quizId];
      return {
        id: `${userId}-${quizId}-${index}`,
        templateId: quizId,
        title: quiz.title,
        tags: quiz.tags,
        difficulty: quiz.difficulty,
        status: 'pending',
        assignedBy: 'u1',
        assignedAt: new Date().toISOString()
      };
    });
    acc[userId] = items;
    return acc;
  }, {});
};

export const useQuizzesStore = create(
  persist(
    (set, get) => ({
      assignments: [],
      inboxByUser: buildInitialInbox(),
      assignFromTemplate(templateId, payload) {
        const { assignees, dueDate, visibility, tags = [] } = payload;
        const template = useLibraryStore.getState().templates.find((item) => item.id === templateId);
        if (!template) {
          throw new Error('TEMPLATE_NOT_FOUND');
        }
        const assignment = {
          id: `assign-${nanoid(6)}`,
          templateId,
          assignees,
          dueDate,
          visibility,
          tags: tags.length ? tags : template.tags,
          title: template.title,
          createdAt: new Date().toISOString()
        };
        const newInbox = { ...get().inboxByUser };
        assignees.forEach((userId) => {
          const entry = {
            id: `quiz-${nanoid(6)}`,
            templateId,
            title: template.title,
            tags: assignment.tags,
            difficulty: template.difficulty,
            status: 'pending',
            assignedBy: 'u1',
            assignedAt: new Date().toISOString(),
            dueDate
          };
          newInbox[userId] = [entry, ...(newInbox[userId] || [])];
          useNotificationsStore
            .getState()
            .pushNotification(userId, {
              type: 'assign',
              title: template.title,
              message: 'notifications.assigned'
            });
        });
        set({
          assignments: [assignment, ...get().assignments],
          inboxByUser: newInbox
        });
        return assignment;
      },
      listInbox(userId) {
        return get().inboxByUser[userId] || [];
      },
      markDone(userId, quizId) {
        const inbox = get().inboxByUser[userId] || [];
        const updated = inbox.map((quiz) => (quiz.id === quizId ? { ...quiz, status: 'done', completedAt: new Date().toISOString() } : quiz));
        set({
          inboxByUser: {
            ...get().inboxByUser,
            [userId]: updated
          }
        });
        useNotificationsStore
          .getState()
          .pushNotification('u1', {
            type: 'quiz-done',
            title: 'Quiz concluído',
            message: 'notifications.taskUpdated',
            actor: userId
          });
      }
    }),
    {
      name: 'quizzes-store',
      storage: createLocalForageStorage('af')
    }
  )
);
