import { createEntityStore } from './store';
import { tasks as initialTasks, seedDataVersion } from './data';

const store = createEntityStore('ascenda_tasks', initialTasks, {
  version: seedDataVersion,
});

export const Task = {
  list(sort, limit) {
    return store.list(sort, limit);
  },

  filter(criteria, sort, limit) {
    return store.filter(criteria, sort, limit);
  },

  find(id) {
    return store.findById(id);
  },

  update(id, updates) {
    return store.update(id, updates);
  }
};

