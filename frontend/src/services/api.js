import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export function attachAuthHeaders(user) {
  if (!user) return;
  const id = user.externalId || user.name;
  api.defaults.headers.common['X-User-Id'] = id;
  api.defaults.headers.common['X-User-Role'] = user.role;
}

export function clearAuthHeaders() {
  delete api.defaults.headers.common['X-User-Id'];
  delete api.defaults.headers.common['X-User-Role'];
}

/** Student */
export const studentService = {
  // Fetch all available courses
  getCourses: () => api.get('/courses'),
  // Request a course using offering_id (or course_id if available)
  requestCourse: (body) => api.post('/courses/request', body),
  // Fetch student profile information from database
  getStudentProfile: (userId) => api.get('/users/profile', {
    headers: { 'user-id': userId }
  }),
  // Fetch student enrollments (for calculating applied credits)
  getStudentEnrollments: (userId) => api.get('/courses/student-enrollments', {
    params: { user_id: userId },
    headers: { 'user-id': userId }
  }),
};

/** Professor */
export const professorService = {
  createCourse: (data) => api.post('/courses/add', data),
  updateCourse: (courseId, data) => api.patch(`/course/${courseId}`, data),
  setPriority: (offeringId, data) => api.put(`/courses/offering/${offeringId}/rules`, data),
  runAllocation: (offeringId) => api.post(`/courses/offering/${offeringId}/allocate`),
  setPrerequisite: (courseId, prerequisiteId) =>
    api.post(`/courses/${encodeURIComponent(courseId)}/prerequisites`, {
      prerequisite_id: prerequisiteId,
    }),
  getMyCourses: (userId) => {
    const config = userId
      ? { params: { user_id: userId }, headers: { 'x-user-id': userId } }
      : undefined;
    return api.get('/courses/professor/courses', config);
  },
  getIncomingRequests: (userId) => {
    const config = userId
      ? { params: { user_id: userId }, headers: { 'x-user-id': userId } }
      : undefined;
    return api.get('/courses/professor/requests', config);
  },
};

/** Admin */
export const adminService = {
  runAllocation: () => api.post('/run-allocation'),
};

export default api;
