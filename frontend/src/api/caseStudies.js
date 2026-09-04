import apiClient from "./client";

export const caseStudiesApi = {
  getCaseStudies: async () => {
    const response = await apiClient.get("/api/case-studies");
    return response.data;
  },

  getCaseStudyById: async (id) => {
    const response = await apiClient.get(`/api/case-studies/${id}`);
    return response.data;
  },

  createCaseStudy: async (data) => {
    const response = await apiClient.post("/api/case-studies", data);
    return response.data;
  },

  updateCaseStudy: async (id, data) => {
    const response = await apiClient.put(`/api/case-studies/${id}`, data);
    return response.data;
  },

  deleteCaseStudy: async (id) => {
    const response = await apiClient.delete(`/api/case-studies/${id}`);
    return response.data;
  },

  getComments: async (caseStudyId) => {
    const response = await apiClient.get(`/api/case-studies/${caseStudyId}/comments`);
    return response.data;
  },

  addComment: async (data) => {
    const response = await apiClient.post("/api/case-studies/comments", data);
    return response.data;
  },

  getSupportGroups: async () => {
    const response = await apiClient.get("/api/case-studies/support-groups");
    return response.data;
  },

  createSupportGroup: async (data) => {
    const response = await apiClient.post("/api/case-studies/support-groups", data);
    return response.data;
  },

  joinSupportGroup: async (groupId, userId) => {
    const response = await apiClient.post(`/api/case-studies/support-groups/${groupId}/join`, { userId });
    return response.data;
  },
};

