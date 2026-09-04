import apiClient from "./client";

export const authApi = {
  signup: async (userData) => {
    const response = await apiClient.post("/api/auth/signup", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post("/api/auth/login", credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get("/api/auth/profile");
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.get("/api/auth/logout");
    return response.data;
  },
};

