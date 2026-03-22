import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as endorsementsApi from '../endorsementsApi';
import api from '../axiosInstance';

vi.mock('../axiosInstance');

describe('endorsementsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEndorsements', () => {
    it('fetches endorsements for a policy', async () => {
      api.get.mockResolvedValue({ data: { data: [], meta: {} } });

      await endorsementsApi.getEndorsements('pol-1', 2);

      expect(api.get).toHaveBeenCalledWith('/policies/pol-1/endorsements', { params: { page: 2 } });
    });

    it('defaults to page 1', async () => {
      api.get.mockResolvedValue({ data: {} });
      await endorsementsApi.getEndorsements('pol-1');
      expect(api.get).toHaveBeenCalledWith('/policies/pol-1/endorsements', { params: { page: 1 } });
    });
  });

  describe('getEndorsement', () => {
    it('fetches a single endorsement', async () => {
      const mockData = { data: { id: 'end-1', endorsement_type: 'policy_change' } };
      api.get.mockResolvedValue({ data: mockData });

      const result = await endorsementsApi.getEndorsement('end-1');

      expect(api.get).toHaveBeenCalledWith('/endorsements/end-1');
      expect(result).toEqual(mockData);
    });
  });

  describe('createEndorsement', () => {
    it('wraps data in endorsement key with policy id in URL', async () => {
      const data = { endorsement_type: 'cancellation', effective_date: '2024-01-01', premium: 100 };
      api.post.mockResolvedValue({ data: { data: { id: 'new' } } });

      await endorsementsApi.createEndorsement('pol-1', data);

      expect(api.post).toHaveBeenCalledWith('/policies/pol-1/endorsements', { endorsement: data });
    });
  });

  describe('updateEndorsement', () => {
    it('wraps data in endorsement key and sends PATCH', async () => {
      const data = { premium: 200 };
      api.patch.mockResolvedValue({ data: { data: { id: 'end-1' } } });

      await endorsementsApi.updateEndorsement('end-1', data);

      expect(api.patch).toHaveBeenCalledWith('/endorsements/end-1', { endorsement: data });
    });
  });
});
