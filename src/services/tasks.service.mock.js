import { useTasksStore } from '../state/useTasksStore';

export const tasksService = {
  listBoard(userId) {
    return useTasksStore.getState().tasksByUser[userId] || [];
  },
  moveTask(userId, taskId, status) {
    useTasksStore.getState().moveTask(userId, taskId, status);
  }
};
