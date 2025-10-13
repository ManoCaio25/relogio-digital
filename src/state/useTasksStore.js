import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid/non-secure';
import { MOCK_TASKS } from '../mocks/tasks.mock';
import { createLocalForageStorage } from './createLocalForageStorage';
import { useNotificationsStore } from './useNotificationsStore';

const interns = ['u2', 'u3', 'u4', 'u5', 'u6', 'u7'];

const buildInitialTasks = () =>
  interns.reduce((acc, userId, index) => {
    acc[userId] = MOCK_TASKS.map((task, idx) => ({
      ...task,
      id: `${userId}-${task.id}-${idx}`,
      status: idx % 3 === 0 ? 'doing' : task.status
    }));
    return acc;
  }, {});

export const useTasksStore = create(
  persist(
    (set, get) => ({
      tasksByUser: buildInitialTasks(),
      moveTask(userId, taskId, status) {
        const board = get().tasksByUser[userId] || [];
        const updated = board.map((task) => (task.id === taskId ? { ...task, status } : task));
        set({
          tasksByUser: {
            ...get().tasksByUser,
            [userId]: updated
          }
        });
        useNotificationsStore.getState().pushNotification('u1', {
          type: 'task-move',
          title: 'Atividade atualizada',
          message: 'notifications.taskUpdated',
          actor: userId
        });
      },
      addTask(userId, payload) {
        const task = {
          id: `task-${nanoid(6)}`,
          status: 'todo',
          ...payload
        };
        set({
          tasksByUser: {
            ...get().tasksByUser,
            [userId]: [task, ...(get().tasksByUser[userId] || [])]
          }
        });
      }
    }),
    {
      name: 'tasks-store',
      storage: createLocalForageStorage('af')
    }
  )
);
