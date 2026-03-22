import api from './axiosInstance';

export const getAccounts = async (page = 1) => {
  const response = await api.get('/accounts', { params: { page } });
  return response.data;
};

export const getAccount = async (id) => {
  const response = await api.get(`/accounts/${id}`);
  return response.data;
};

export const createAccount = async (data) => {
  const { address_line1, address_line2, city, state, zip_code, ...rest } = data;
  const payload = {
    account: {
      ...rest,
      address: { address_line1, address_line2, city, state, zip_code },
    },
  };
  const response = await api.post('/accounts', payload);
  return response.data;
};

export const updateAccount = async (id, data) => {
  const { address_line1, address_line2, city, state, zip_code, ...rest } = data;
  const payload = {
    account: {
      ...rest,
      address: { address_line1, address_line2, city, state, zip_code },
    },
  };
  const response = await api.patch(`/accounts/${id}`, payload);
  return response.data;
};

export const deleteAccount = async (id) => {
  await api.delete(`/accounts/${id}`);
};

export const getAccountPolicies = async (accountId, page = 1) => {
  const response = await api.get(`/accounts/${accountId}/policies`, { params: { page } });
  return response.data;
};
