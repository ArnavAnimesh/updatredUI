/**
 * startupSubmissionService.js
 * This service handles all API calls related to Startup Submissions.
 * Includes methods for both Entrepreneurs (Submitting) and Mentors (Reviewing).
 */

import api from '../apiConfig';

const startupSubmissionService = {
    /**
     * createSubmission (Entrepreneur)
     * Submits a new startup idea with a PDF file using FormData.
     */
    createSubmission: async (formData) => {
        try {
            const response = await api.post('/submission/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Failed to submit idea");
        }
    },
    
    /**
     * getMySubmissions (Entrepreneur)
     * Fetches all submissions made by the currently logged-in user.
     * Supports: page, category search.
     */
    getMySubmissions: async (params = {}) => {
        try {
            const response = await api.get('/submission/my-submissions', { params });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Failed to fetch your submissions");
        }
    },

    /**
     * deleteMySubmission (Entrepreneur)
     * Allows an entrepreneur to remove their own submission.
     */
    deleteMySubmission: async (id) => {
        try {
            const response = await api.delete(`/submission/delete/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Failed to remove submission");
        }
    },

    /**
     * getMentorSubmissions (Mentor)
     * Fetches submissions received for the mentor's profiles.
     * Supports: page, status, order.
     */
    getMentorSubmissions: async (params = {}) => {
        try {
            const response = await api.get('/submission/all', { params });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Failed to fetch submissions");
        }
    },

    /**
     * updateStatus (Mentor)
     * Updates the status of a submission (Shortlist/Reject).
     */
    updateStatus: async (id, status) => {
        try {
            const response = await api.put(`/submission/status/${id}`, { status });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Failed to update status");
        }
    },

    /**
     * deleteSubmission (Mentor)
     * Deletes a submission from the mentor's dashboard.
     */
    deleteSubmission: async (id) => {
        try {
            const response = await api.delete(`/submission/delete/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error("Failed to delete submission");
        }
    }
};

export default startupSubmissionService;
