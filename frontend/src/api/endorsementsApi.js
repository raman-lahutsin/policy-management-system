import api from './axiosInstance';

export const getEndorsements = async (policyId, page = 1) => {
  const response = await api.get(`/policies/${policyId}/endorsements`, { params: { page } });
  return response.data;
};

export const getEndorsement = async (id) => {
  const response = await api.get(`/endorsements/${id}`);
  return response.data;
};

export const createEndorsement = async (policyId, data) => {
  const response = await api.post(`/policies/${policyId}/endorsements`, { endorsement: data });
  return response.data;
};

export const updateEndorsement = async (id, data) => {
  const response = await api.patch(`/endorsements/${id}`, { endorsement: data });
  return response.data;
};
