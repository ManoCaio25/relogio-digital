import { useForumStore } from '../state/useForumStore';

export const forumService = {
  listThreads() {
    return useForumStore.getState().threads;
  },
  getThread(threadId) {
    return useForumStore.getState().threads.find((thread) => thread.id === threadId);
  },
  addMessage(threadId, message) {
    useForumStore.getState().addMessage(threadId, message);
  }
};
