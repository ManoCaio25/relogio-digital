import { MOCK_USERS } from '../mocks/users.mock';
import { storage } from './storage.service';

const STORAGE_KEY = 'af:user';

export const authService = {
  async login(email, password) {
    const user = MOCK_USERS.find((item) => item.login === email && item.password === password);
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }
    await storage.set(STORAGE_KEY, user);
    return user;
  },
  async getCurrentUser() {
    return storage.get(STORAGE_KEY);
  },
  async logout() {
    await storage.remove(STORAGE_KEY);
  }
};
