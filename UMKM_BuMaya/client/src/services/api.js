const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // include cookies for session
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error || `HTTP Error ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  auth: {
    login: (username, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    me: () => request('/auth/me', { method: 'GET' }),
    updateProfile: (data) =>
      request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Menu
  menu: {
    getAll: () => request('/menu', { method: 'GET' }),
    create: (data) =>
      request('/menu', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/menu/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) => request(`/menu/${id}`, { method: 'DELETE' }),
  },

  // Bahan
  bahan: {
    getAll: () => request('/bahan', { method: 'GET' }),
    create: (data) =>
      request('/bahan', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/bahan/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    kurangi: (id, jumlah) =>
      request(`/bahan/${id}/kurangi`, {
        method: 'PATCH',
        body: JSON.stringify({ jumlah }),
      }),
    tambah: (id, jumlah) =>
      request(`/bahan/${id}/tambah`, {
        method: 'PATCH',
        body: JSON.stringify({ jumlah }),
      }),
    delete: (id) => request(`/bahan/${id}`, { method: 'DELETE' }),
  },

  // Pesanan
  pesanan: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/pesanan${query ? `?${query}` : ''}`, { method: 'GET' });
    },
    getById: (id) => request(`/pesanan/${id}`, { method: 'GET' }),
    create: (data) =>
      request('/pesanan', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/pesanan/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) => request(`/pesanan/${id}`, { method: 'DELETE' }),
  },

  // Pemasukan
  pemasukan: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/pemasukan${query ? `?${query}` : ''}`, { method: 'GET' });
    },
    create: (data) =>
      request('/pemasukan', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id) => request(`/pemasukan/${id}`, { method: 'DELETE' }),
  },

  // Pengeluaran
  pengeluaran: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/pengeluaran${query ? `?${query}` : ''}`, { method: 'GET' });
    },
    create: (data) =>
      request('/pengeluaran', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      request(`/pengeluaran/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) => request(`/pengeluaran/${id}`, { method: 'DELETE' }),
  },

  // Dashboard
  dashboard: {
    getSummary: () => request('/dashboard', { method: 'GET' }),
    getGrafik: () => request('/dashboard/grafik', { method: 'GET' }),
    getMenuTerlaris: () => request('/dashboard/menu-terlaris', { method: 'GET' }),
  },

  // Rekap
  rekap: {
    get: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/rekap${query ? `?${query}` : ''}`, { method: 'GET' });
    },
    getExportUrl: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return `/api/rekap/export${query ? `?${query}` : ''}`;
    },
  },
};
