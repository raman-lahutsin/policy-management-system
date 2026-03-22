import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authApi from '../authApi';
import api from '../axiosInstance';

vi.mock('../axiosInstance');

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('posts credentials and returns data', async () => {
      const mockResponse = { data: { token: 'jwt', user: { id: '1', email: 'test@test.com' } } };
      api.post.mockResolvedValue(mockResponse);

      const result = await authApi.login('test@test.com', 'password');

      expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'test@test.com', password: 'password' });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('register', () => {
    it('posts registration data and returns data', async () => {
      const formData = { email: 'new@test.com', password: 'pass', first_name: 'John', last_name: 'Doe' };
      const mockResponse = { data: { token: 'jwt', user: { id: '2' } } };
      api.post.mockResolvedValue(mockResponse);

      const result = await authApi.register(formData);

      expect(api.post).toHaveBeenCalledWith('/auth/register', formData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getMe', () => {
    it('fetches current user', async () => {
      const mockResponse = { data: { user: { id: '1', email: 'test@test.com' } } };
      api.get.mockResolvedValue(mockResponse);

      const result = await authApi.getMe();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockResponse.data);
    });
  });
});
