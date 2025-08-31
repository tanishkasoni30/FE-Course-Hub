import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (email) => api.post('/auth/resend-otp', { email }),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getInstructors: () => api.get('/users/instructors'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getDashboard: (id) => api.get(`/users/${id}/dashboard`),
  getPurchasedCourses: (id) => api.get(`/users/${id}/purchased-courses`),
};

// Courses API
export const coursesAPI = {
  getAll: (params = {}) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (courseData) => {
    // Check if courseData is FormData (for file uploads)
    if (courseData instanceof FormData) {
      // Remove Content-Type header for FormData to let browser set it with boundary
      const config = {
        headers: {
          'Content-Type': undefined, // Let browser set the correct Content-Type for FormData
        }
      };
      return api.post('/courses', courseData, config);
    }
    // Regular JSON data
    return api.post('/courses', courseData);
  },
  update: (id, data) => {
    // Check if data is FormData (for file uploads)
    if (data instanceof FormData) {
      const config = {
        headers: {
          'Content-Type': undefined, // Let browser set the correct Content-Type for FormData
        }
      };
      return api.put(`/courses/${id}`, data, config);
    }
    // Regular JSON data
    return api.put(`/courses/${id}`, data);
  },
  delete: (id) => api.delete(`/courses/${id}`),
  getReviews: (id) => api.get(`/courses/${id}/reviews`),
  getBuyers: (id) => api.get(`/courses/${id}/buyers`),
  getByInstructor: (instructorId) => api.get(`/courses/instructor/${instructorId}`),
  getAnalytics: (id) => api.get(`/courses/${id}/analytics`),
};

// Orders API
export const ordersAPI = {
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  update: (id, data) => api.put(`/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/${id}`),
  getByUser: (userId) => api.get(`/orders/by/user/${userId}`),
  getByCourse: (courseId) => api.get(`/orders/by/course/${courseId}`),
  getStats: () => api.get('/orders/stats'),
  processPayment: (paymentData) => api.post('/orders/process-payment', paymentData),
};

// Reviews API
export const reviewsAPI = {
  getAll: (params = {}) => api.get('/reviews', { params }),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (reviewData) => api.post('/reviews', reviewData),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  getByCourse: (courseId, params = {}) => api.get(`/reviews/by/course/${courseId}`, { params }),
  getByUser: (userId) => api.get(`/reviews/by/user/${userId}`),
  getAverageRating: (courseId) => api.get(`/reviews/avg/course/${courseId}`),
  getStats: () => api.get('/reviews/stats'),
};

export default api;