/**
 * Startup Slice
 * This Redux slice manages the state of startup profiles, including
 * loading states, pagination metadata, and the profile list itself.
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profiles: [], // The list of profiles for the current page
    loading: false, // Global loading state for fetching
    error: null, // Error message if any
    pagination: {
        currentPage: 1,
        pageSize: 20,
        totalRecords: 0,
        totalPages: 0
    }
};

const startupSlice = createSlice({
    name: 'startup',
    initialState,
    reducers: {
        // Start loading
        fetchStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        // Populate profiles and pagination metadata
        fetchSuccess: (state, action) => {
            state.loading = false;
            state.profiles = action.payload.data;
            state.pagination = action.payload.pagination;
        },
        // Handle failures
        fetchFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Reset state (e.g. on logout)
        resetStartupState: (state) => {
            return initialState;
        }
    }
});

export const { fetchStart, fetchSuccess, fetchFailure, resetStartupState } = startupSlice.actions;

export default startupSlice.reducer;
