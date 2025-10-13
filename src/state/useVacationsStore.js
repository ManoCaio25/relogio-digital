import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid/non-secure';
import { createLocalForageStorage } from './createLocalForageStorage';
import { useNotificationsStore } from './useNotificationsStore';
import { calendarService } from '../services/calendar.service.mock';

export const useVacationsStore = create(
  persist(
    (set, get) => ({
      requests: [],
      requestVacation(userId, payload) {
        const request = {
          id: `vac-${nanoid(6)}`,
          userId,
          status: 'pending',
          createdAt: new Date().toISOString(),
          ...payload
        };
        set({ requests: [request, ...get().requests] });
        useNotificationsStore.getState().pushNotification('u1', {
          type: 'vacation-request',
          title: 'Nova solicitação de férias',
          message: 'vacations.request',
          actor: userId
        });
        return request;
      },
      updateStatus(requestId, status) {
        const requests = get().requests.map((request) =>
          request.id === requestId ? { ...request, status, updatedAt: new Date().toISOString() } : request
        );
        set({ requests });
        const request = requests.find((item) => item.id === requestId);
        if (!request) return;
        if (status === 'approved') {
          calendarService.addEvent({
            title: `Férias ${request.userId}`,
            start: request.startDate,
            end: request.endDate
          });
          useNotificationsStore.getState().pushNotification(request.userId, {
            type: 'vacation-approved',
            title: 'Férias aprovadas',
            message: 'notifications.vacationApproved'
          });
        } else if (status === 'rejected') {
          useNotificationsStore.getState().pushNotification(request.userId, {
            type: 'vacation-rejected',
            title: 'Férias rejeitadas',
            message: 'notifications.vacationRejected'
          });
        }
      },
      listByUser(userId) {
        return get().requests.filter((request) => request.userId === userId);
      },
      listPending() {
        return get().requests.filter((request) => request.status === 'pending');
      }
    }),
    {
      name: 'vacations-store',
      storage: createLocalForageStorage('af')
    }
  )
);
