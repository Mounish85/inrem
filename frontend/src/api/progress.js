import apiClient from "./client";

export const progressApi = {
  getUserProgress: async (userId) => {
    const response = await apiClient.get(`/api/progress/user/${userId}`);
    return response.data;
  },

  startSession: async (data) => {
    const response = await apiClient.post("/api/progress/start", data);
    return response.data;
  },

  completeSession: async (data) => {
    const response = await apiClient.post("/api/progress/complete", data);
    return response.data;
  },
};

