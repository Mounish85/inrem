import apiClient from "./client";

export const resourcesApi = {
  getSessionResources: async (sessionId) => {
    const response = await apiClient.get(`/api/resources/session/${sessionId}`);
    return response.data;
  },

  getResourceById: async (id) => {
    const response = await apiClient.get(`/api/resources/${id}`);
    return response.data;
  },

  createResource: async (data) => {
    const response = await apiClient.post("/api/resources", data);
    return response.data;
  },

  updateResource: async (id, data) => {
    const response = await apiClient.put(`/api/resources/${id}`, data);
    return response.data;
  },

  deleteResource: async (id) => {
    const response = await apiClient.delete(`/api/resources/${id}`);
    return response.data;
  },
};

