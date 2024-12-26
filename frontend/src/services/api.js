// src/services/api.js
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:5001/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Create an axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Axios Interceptor to attach JWT token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions

// Event APIs
export const getEvents = () => axiosInstance.get('/events');
export const createEvent = (eventData) => axiosInstance.post('/events', eventData);
export const updateEvent = (id, eventData) => axiosInstance.put(`/events/${id}`, eventData);
export const deleteEvent = (id) => axiosInstance.delete(`/events/${id}`);

// Attendee APIs
export const getAttendees = () => axiosInstance.get('/attendees');
export const createAttendee = (attendeeData) => axiosInstance.post('/attendees', attendeeData);
export const deleteAttendee = (id) => axiosInstance.delete(`/attendees/${id}`);
export const assignAttendeeToEvent = (attendeeId, eventId) => axiosInstance.post(`/attendees/${attendeeId}/assign/${eventId}`);

// Task APIs
export const getTasksForEvent = (eventId) => axiosInstance.get(`/tasks/event/${eventId}`);
export const createTask = (taskData) => axiosInstance.post('/tasks', taskData);
export const updateTaskStatus = (taskId, status) => axiosInstance.put(`/tasks/${taskId}/status`, { status });
