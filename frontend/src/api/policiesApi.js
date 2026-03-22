import api from './axiosInstance';

export const getPolicies = async (page = 1) => {
  const response = await api.get('/policies', { params: { page } });
  return response.data;
};

export const getPolicy = async (id) => {
  const response = await api.get(`/policies/${id}`);
  return response.data;
};

export const createPolicy = async (data) => {
  const response = await api.post('/policies', { policy: data });
  return response.data;
};

export const updatePolicy = async (id, data) => {
  const response = await api.patch(`/policies/${id}`, { policy: data });
  return response.data;
};

export const deletePolicy = async (id) => {
  await api.delete(`/policies/${id}`);
};
