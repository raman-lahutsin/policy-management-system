import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as policiesApi from '../policiesApi';
import api from '../axiosInstance';

vi.mock('../axiosInstance');

describe('policiesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPolicies', () => {
    it('fetches paginated policies', async () => {
      const mockData = { data: [], meta: { current_page: 1 } };
      api.get.mockResolvedValue({ data: mockData });

      const result = await policiesApi.getPolicies(2);

      expect(api.get).toHaveBeenCalledWith('/policies', { params: { page: 2 } });
      expect(result).toEqual(mockData);
    });

    it('defaults to page 1', async () => {
      api.get.mockResolvedValue({ data: {} });
      await policiesApi.getPolicies();
      expect(api.get).toHaveBeenCalledWith('/policies', { params: { page: 1 } });
    });
  });

  describe('getPolicy', () => {
    it('fetches a single policy', async () => {
      const mockData = { data: { id: 'pol-1', policy_number: 'POL-ABC' } };
      api.get.mockResolvedValue({ data: mockData });

      const result = await policiesApi.getPolicy('pol-1');

      expect(api.get).toHaveBeenCalledWith('/policies/pol-1');
      expect(result).toEqual(mockData);
    });
  });

  describe('createPolicy', () => {
    it('wraps data in policy key', async () => {
      const policyData = { account_id: 'acc-1', insurance_type: 'general_liability', premium: 500 };
      api.post.mockResolvedValue({ data: { data: { id: 'new' } } });

      await policiesApi.createPolicy(policyData);

      expect(api.post).toHaveBeenCalledWith('/policies', { policy: policyData });
    });
  });

  describe('updatePolicy', () => {
    it('wraps data in policy key and sends PATCH', async () => {
      const policyData = { status: 'active' };
      api.patch.mockResolvedValue({ data: { data: { id: 'pol-1' } } });

      await policiesApi.updatePolicy('pol-1', policyData);

      expect(api.patch).toHaveBeenCalledWith('/policies/pol-1', { policy: policyData });
    });
  });

  describe('deletePolicy', () => {
    it('sends DELETE request', async () => {
      api.delete.mockResolvedValue({});
      await policiesApi.deletePolicy('pol-1');
      expect(api.delete).toHaveBeenCalledWith('/policies/pol-1');
    });
  });
});
