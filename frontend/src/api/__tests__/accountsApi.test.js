import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as accountsApi from '../accountsApi';
import api from '../axiosInstance';

vi.mock('../axiosInstance');

describe('accountsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAccounts', () => {
    it('fetches paginated accounts', async () => {
      const mockResponse = { data: { data: [], meta: { current_page: 1, total_count: 0, total_pages: 0 } } };
      api.get.mockResolvedValue(mockResponse);

      const result = await accountsApi.getAccounts(2);

      expect(api.get).toHaveBeenCalledWith('/accounts', { params: { page: 2 } });
      expect(result).toEqual(mockResponse.data);
    });

    it('defaults to page 1', async () => {
      api.get.mockResolvedValue({ data: {} });
      await accountsApi.getAccounts();
      expect(api.get).toHaveBeenCalledWith('/accounts', { params: { page: 1 } });
    });
  });

  describe('getAccount', () => {
    it('fetches a single account', async () => {
      const mockResponse = { data: { data: { id: 'abc', first_name: 'John' } } };
      api.get.mockResolvedValue(mockResponse);

      const result = await accountsApi.getAccount('abc');

      expect(api.get).toHaveBeenCalledWith('/accounts/abc');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createAccount', () => {
    it('wraps address fields in nested object', async () => {
      api.post.mockResolvedValue({ data: { data: { id: 'new-id' } } });

      await accountsApi.createAccount({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@test.com',
        address_line1: '123 Main St',
        address_line2: '',
        city: 'NYC',
        state: 'NY',
        zip_code: '10001',
      });

      expect(api.post).toHaveBeenCalledWith('/accounts', {
        account: {
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@test.com',
          address: {
            address_line1: '123 Main St',
            address_line2: '',
            city: 'NYC',
            state: 'NY',
            zip_code: '10001',
          },
        },
      });
    });
  });

  describe('updateAccount', () => {
    it('sends PATCH with nested address', async () => {
      api.patch.mockResolvedValue({ data: { data: { id: 'abc' } } });

      await accountsApi.updateAccount('abc', {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@test.com',
        address_line1: '456 Oak Ave',
        address_line2: 'Apt 2',
        city: 'LA',
        state: 'CA',
        zip_code: '90001',
      });

      expect(api.patch).toHaveBeenCalledWith('/accounts/abc', {
        account: {
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@test.com',
          address: {
            address_line1: '456 Oak Ave',
            address_line2: 'Apt 2',
            city: 'LA',
            state: 'CA',
            zip_code: '90001',
          },
        },
      });
    });
  });

  describe('deleteAccount', () => {
    it('sends DELETE request', async () => {
      api.delete.mockResolvedValue({});
      await accountsApi.deleteAccount('abc');
      expect(api.delete).toHaveBeenCalledWith('/accounts/abc');
    });
  });

  describe('getAccountPolicies', () => {
    it('fetches policies for an account', async () => {
      api.get.mockResolvedValue({ data: { data: [], meta: {} } });

      await accountsApi.getAccountPolicies('acc-1', 3);

      expect(api.get).toHaveBeenCalledWith('/accounts/acc-1/policies', { params: { page: 3 } });
    });
  });
});
