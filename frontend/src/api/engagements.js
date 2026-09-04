import apiClient from "./client";

export const engagementsApi = {
  createEngagement: async (data) => {
    const response = await apiClient.post("/api/engagements", data);
    return response.data;
  },

  getUserEngagements: async (userId) => {
    const response = await apiClient.get(`/api/engagements/user/${userId}`);
    return response.data;
  },

  updateEngagement: async (id, data) => {
    const response = await apiClient.put(`/api/engagements/${id}`, data);
    return response.data;
  },

  getJourneyRecommendation: async (userId) => {
    const response = await apiClient.get(`/api/engagements/user/${userId}/recommendation`);
    return response.data;
  },
};

