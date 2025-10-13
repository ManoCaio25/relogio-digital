import { create } from 'zustand';
import { notifyService } from '../services/notify.service.js';
import { useAuthStore } from './useAuthStore';

export const useNotificationsStore = create((set, get) => ({
  notifications: {},
  pushNotification(userId, payload) {
    set((state) => {
      const list = state.notifications[userId] || [];
      return {
        notifications: {
          ...state.notifications,
          [userId]: [
            {
              id: `${Date.now()}-${Math.random()}`,
              createdAt: new Date().toISOString(),
              ...payload
            },
            ...list
          ]
        }
      };
    });
    if (useAuthStore.getState().user?.id === userId) {
      notifyService.play();
    }
  },
  popNotification(userId) {
    const list = get().notifications[userId] || [];
    if (!list.length) return null;
    const [latest, ...rest] = list;
    set((state) => ({
      notifications: {
        ...state.notifications,
        [userId]: rest
      }
    }));
    return latest;
  }
}));
