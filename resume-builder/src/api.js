import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export const register = (formData) => API.post('/auth/register', formData);
export const login = (formData) => API.post('/auth/login', formData);
export const createResume = (formData) => API.post('/resumes', formData);
export const editResume = (id, formData) => API.put(`/resumes/${id}`, formData);
export const deleteResume = (id) => API.delete(`/resumes/${id}`);
export const getAISuggestions = (id, jobDescription) =>
  API.post(`/resumes/${id}/ai-suggestions`, { jobDescription });
