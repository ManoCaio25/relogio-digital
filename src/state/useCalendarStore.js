import { create } from 'zustand';
import { calendarService } from '../services/calendar.service.mock';

export const useCalendarStore = create((set, get) => ({
  events: calendarService.listEvents(),
  addEvent(event) {
    const stored = calendarService.addEvent(event);
    set({ events: [...get().events, stored] });
    return stored;
  }
}));
