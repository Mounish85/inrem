import apiClient from "./client";

export const coursesApi = {
  getCourses: async () => {
    const response = await apiClient.get("/api/courses");
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await apiClient.get(`/api/courses/${id}`);
    return response.data;
  },

  createCourse: async (data) => {
    const response = await apiClient.post("/api/courses", data);
    return response.data;
  },

  updateCourse: async (id, data) => {
    const response = await apiClient.put(`/api/courses/${id}`, data);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await apiClient.delete(`/api/courses/${id}`);
    return response.data;
  },
};

