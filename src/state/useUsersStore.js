import { create } from 'zustand';
import { MOCK_USERS } from '../mocks/users.mock';

export const useUsersStore = create(() => ({
  users: MOCK_USERS,
  getInterns: () => MOCK_USERS.filter((user) => user.role === 'intern'),
  getById: (id) => MOCK_USERS.find((user) => user.id === id)
}));
