import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_VIDEOS } from '../mocks/videos.mock';
import { createLocalForageStorage } from './createLocalForageStorage';

export const useVideosStore = create(
  persist(
    (set, get) => ({
      videos: MOCK_VIDEOS,
      progressByUser: {},
      setProgress(userId, videoId, seconds) {
        const current = get().progressByUser[userId] || {};
        set({
          progressByUser: {
            ...get().progressByUser,
            [userId]: {
              ...current,
              [videoId]: seconds
            }
          }
        });
      },
      getProgress(userId, videoId) {
        return get().progressByUser[userId]?.[videoId] || 0;
      }
    }),
    {
      name: 'videos-store',
      storage: createLocalForageStorage('af')
    }
  )
);
