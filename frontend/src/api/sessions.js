import apiClient from "./client";

export const sessionsApi = {
  getCourseSessions: async (courseId) => {
    const response = await apiClient.get(`/api/sessions/course/${courseId}`);
    return response.data;
  },

  getSessionById: async (id) => {
    const response = await apiClient.get(`/api/sessions/${id}`);
    return response.data;
  },

  createSession: async (data) => {
    const response = await apiClient.post("/api/sessions", data);
    return response.data;
  },

  updateSession: async (id, data) => {
    const response = await apiClient.put(`/api/sessions/${id}`, data);
    return response.data;
  },

  deleteSession: async (id) => {
    const response = await apiClient.delete(`/api/sessions/${id}`);
    return response.data;
  },

  startSession: async (data) => {
    const response = await apiClient.post("/api/sessions/start", data);
    return response.data;
  },

  completeSession: async (data) => {
    const response = await apiClient.post("/api/sessions/complete", data);
    return response.data;
  },
};

