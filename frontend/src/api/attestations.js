import apiClient from "./client";

export const attestationsApi = {
  startAttestation: async (data) => {
    const response = await apiClient.post("/api/attestations/start", data);
    return response.data;
  },

  recordContentAccess: async (data) => {
    const response = await apiClient.post("/api/attestations/content", data);
    return response.data;
  },

  endAttestation: async (data) => {
    const response = await apiClient.post("/api/attestations/end", data);
    return response.data;
  },
};

