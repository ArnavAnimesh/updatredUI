/**
 * Startup Service
 * This file handles all API calls related to Startup Profiles.
 * It uses the central axios instance from apiConfig.js.
 */

import api from '../apiConfig';

const startupService = {
    /**
     * createProfile
     * Sends a POST request to create a new startup opportunity.
     */
    createProfile: async (profileData) => {
        try {
            const response = await api.post('/startup/create', profileData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Network error");
        }
    },

    /**
     * getAllProfiles
     * Fetches a paginated list of startup profiles.
     * Supports 'page', 'keyword', 'sortBy', and 'order' as query parameters.
     */
    getAllProfiles: async (params = {}) => {
        try {
            const response = await api.get('/startup/all', { params });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Network error");
        }
    },

    /**
     * updateProfile
     * Sends a PUT request to update an existing profile.
     */
    updateProfile: async (profileId, profileData) => {
        try {
            const response = await api.put(`/startup/update/${profileId}`, profileData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Network error");
        }
    },

    /**
     * deleteProfile
     * Sends a DELETE request to remove a profile.
     */
    deleteProfile: async (profileId) => {
        try {
            const response = await api.delete(`/startup/delete/${profileId}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Network error");
        }
    }
};

export default startupService;
