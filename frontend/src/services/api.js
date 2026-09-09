import axios from 'axios';

const API = axios.create({ baseURL: '/api', withCredentials: true });

let accessToken = null;
export const setAccessToken = (token) => { accessToken = token; };
export const getAccessToken = () => accessToken;

API.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const orig = error.config;
    if (error.response?.status === 401 && !orig._retry && !orig.url.includes('/auth/')) {
      orig._retry = true;
      try {
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        setAccessToken(data.data.accessToken);
        orig.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return API(orig);
      } catch {
        setAccessToken(null);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
