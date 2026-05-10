import axios from 'axios';

// Centralized Axios instance
// In dev, requests to /api are proxied through Vite to the Express backend
// In production, a full URL would be configured here
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

/*
 * All backend responses follow the format:
 *   { success: true, data: ... }  or  { success: false, message: "..." }
 * Axios interceptor unwraps response.data so callers get the raw payload.
 * Error interceptor extracts the server message for consistent error handling.
 */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ───── Books ─────
export const getBooks = () => api.get('/books');

export const getBook = (id) => api.get(`/books/${id}`);

export const createBook = (data) => api.post('/books', data);

export const updateBook = (id, data) => api.put(`/books/${id}`, data);

export const deleteBook = (id) => api.delete(`/books/${id}`);

// ───── Students ─────
export const getStudents = () => api.get('/students');

export const getStudent = (id) => api.get(`/students/${id}`);

export const createStudent = (data) => api.post('/students', data);

export const updateStudent = (id, data) => api.put(`/students/${id}`, data);

export const deleteStudent = (id) => api.delete(`/students/${id}`);

// ───── Library (Issue / Return) ─────
export const issueBook = (studentId, bookId) =>
  api.post(`/library/issue/${studentId}/${bookId}`);

export const returnBook = (studentId, bookId) =>
  api.post(`/library/return/${studentId}/${bookId}`);
