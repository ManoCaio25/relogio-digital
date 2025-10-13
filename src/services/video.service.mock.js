import { useVideosStore } from '../state/useVideosStore';

export const videoService = {
  list() {
    return useVideosStore.getState().videos;
  },
  getProgress(userId, videoId) {
    return useVideosStore.getState().getProgress(userId, videoId);
  },
  setProgress(userId, videoId, seconds) {
    useVideosStore.getState().setProgress(userId, videoId, seconds);
  }
};
