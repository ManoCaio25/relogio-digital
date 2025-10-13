import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service.mock';
import { createLocalForageStorage } from './createLocalForageStorage';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      status: 'idle',
      error: null,
      async login(email, password) {
        set({ status: 'loading', error: null });
        try {
          const user = await authService.login(email, password);
          set({ user, status: 'authenticated', error: null });
          return user;
        } catch (error) {
          set({ status: 'error', error: error.message });
          throw error;
        }
      },
      async logout() {
        await authService.logout();
        set({ user: null, status: 'idle', error: null });
      },
      setUser(user) {
        set({ user });
      }
    }),
    {
      name: 'auth-store',
      storage: createLocalForageStorage('af')
    }
  )
);
