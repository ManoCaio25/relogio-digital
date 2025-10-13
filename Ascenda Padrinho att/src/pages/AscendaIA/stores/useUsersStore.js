import { create } from 'zustand';
import { MOCK_USERS } from '../mocks/users.mock';

export const useUsersStore = create(() => ({
  users: MOCK_USERS,
}));
