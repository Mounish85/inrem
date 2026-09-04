import apiClient from "./client";

export const usersApi = {
  getUsers: async () => {
    const response = await apiClient.get("/api/users");
    return response.data;
  },

  getUserById: async (id) => {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await apiClient.put(`/api/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  },
};

