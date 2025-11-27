// Centralized API configuration
export const API_BASE_URL = 'https://fitness-tracker-be-group-hdgi.vercel.app/api';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register/`,
    LOGIN: `${API_BASE_URL}/auth/login/`,
  },
  ACTIVITIES: {
    BASE: `${API_BASE_URL}/activities/`,
    CREATE: `${API_BASE_URL}/activities/create/`,
    UPDATE: (id: number) => `${API_BASE_URL}/activities/${id}/`,
    DELETE: (id: number) => `${API_BASE_URL}/activities/${id}/`,
  },
};
