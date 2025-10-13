import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid/non-secure';
import { MOCK_THREADS } from '../mocks/forum.mock';
import { createLocalForageStorage } from './createLocalForageStorage';

export const useForumStore = create(
  persist(
    (set, get) => ({
      threads: MOCK_THREADS,
      addMessage(threadId, message) {
        set({
          threads: get().threads.map((thread) =>
            thread.id === threadId
              ? {
                  ...thread,
                  messages: [
                    {
                      id: `msg-${nanoid(6)}`,
                      createdAt: new Date().toISOString(),
                      ...message
                    },
                    ...thread.messages
                  ]
                }
              : thread
          )
        });
      },
      addThread(payload) {
        const thread = {
          id: `thread-${nanoid(6)}`,
          createdAt: new Date().toISOString(),
          messages: [],
          ...payload
        };
        set({ threads: [thread, ...get().threads] });
        return thread;
      }
    }),
    {
      name: 'forum-store',
      storage: createLocalForageStorage('af')
    }
  )
);
