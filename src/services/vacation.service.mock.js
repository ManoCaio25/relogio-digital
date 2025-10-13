import { useVacationsStore } from '../state/useVacationsStore';

export const vacationService = {
  request(userId, payload) {
    return useVacationsStore.getState().requestVacation(userId, payload);
  },
  listByUser(userId) {
    return useVacationsStore.getState().listByUser(userId);
  },
  listPending() {
    return useVacationsStore.getState().listPending();
  },
  updateStatus(requestId, status) {
    useVacationsStore.getState().updateStatus(requestId, status);
  }
};
