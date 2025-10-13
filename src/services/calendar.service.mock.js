const events = [];

export const calendarService = {
  addEvent(event) {
    events.push({ ...event, id: `cal-${events.length + 1}` });
    return events.at(-1);
  },
  listEvents() {
    return events;
  }
};
