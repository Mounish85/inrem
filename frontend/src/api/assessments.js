import apiClient from "./client";

export const assessmentsApi = {
  getCourseAssessments: async (courseId) => {
    const response = await apiClient.get(`/api/assessments/course/${courseId}`);
    return response.data;
  },

  getAssessmentById: async (id) => {
    const response = await apiClient.get(`/api/assessments/${id}`);
    return response.data;
  },

  createAssessment: async (data) => {
    const response = await apiClient.post("/api/assessments", data);
    return response.data;
  },

  submitAssessment: async (data) => {
    const response = await apiClient.post("/api/assessments/submit", data);
    return response.data;
  },

  getUserAssessmentResults: async (userId) => {
    const response = await apiClient.get(`/api/assessments/results/user/${userId}`);
    return response.data;
  },
};

