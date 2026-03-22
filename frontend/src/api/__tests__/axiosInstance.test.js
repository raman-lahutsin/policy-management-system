import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('axiosInstance', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    delete window.location;
    window.location = { href: '' };
  });

  it('attaches Authorization header when token exists', async () => {
    localStorage.setItem('token', 'test-jwt-token');
    const { default: api } = await import('../axiosInstance');

    const config = { headers: {} };
    const interceptor = api.interceptors.request.handlers[0].fulfilled;
    const result = interceptor(config);

    expect(result.headers.Authorization).toBe('Bearer test-jwt-token');
  });

  it('does not attach Authorization header when no token', async () => {
    const { default: api } = await import('../axiosInstance');

    const config = { headers: {} };
    const interceptor = api.interceptors.request.handlers[0].fulfilled;
    const result = interceptor(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('redirects to /login on 401 response', async () => {
    const { default: api } = await import('../axiosInstance');
    localStorage.setItem('token', 'expired-token');
    localStorage.setItem('user', '{}');

    const interceptor = api.interceptors.response.handlers[0].rejected;
    const error = { response: { status: 401 } };

    await expect(interceptor(error)).rejects.toEqual(error);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(window.location.href).toBe('/login');
  });

  it('does not redirect on non-401 errors', async () => {
    const { default: api } = await import('../axiosInstance');

    const interceptor = api.interceptors.response.handlers[0].rejected;
    const error = { response: { status: 500 } };

    await expect(interceptor(error)).rejects.toEqual(error);
    expect(window.location.href).toBe('');
  });
});
