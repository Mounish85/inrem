import apiClient from "./client";

export const enrollmentsApi = {
  createEnrollment: async (data) => {
    const response = await apiClient.post("/api/enrollments", data);
    return response.data;
  },

  getUserEnrollments: async (userId) => {
    const response = await apiClient.get(`/api/enrollments/user/${userId}`);
    return response.data;
  },

  updateEnrollment: async (id, data) => {
    const response = await apiClient.put(`/api/enrollments/${id}`, data);
    return response.data;
  },
};

