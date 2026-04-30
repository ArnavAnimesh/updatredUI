// This file is a Redux Slice. It manages the "state" of the user (like their name and role).
// It acts like a central storage that any component can read from.

import { createSlice } from '@reduxjs/toolkit';

// Traffic Light Logic:
// null = Still checking (Loading)
// true = Logged in (Success)
// false = Logged out (Failure)
const initialState = {
    isAuthenticated: null, 
    role: null,
    userName: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // This function is called when the user successfully logs in or is verified.
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.role = action.payload.role;
            state.userName = action.payload.userName;
        },
        // This function is called when the user logs out or verification fails.
        logoutSuccess: (state) => {
            state.isAuthenticated = false;
            state.role = null;
            state.userName = null;
        }
    }
});

// We export the actions so we can use them in our components.
export const { loginSuccess, logoutSuccess } = userSlice.actions;

// We export the reducer to be added to the main store.
export default userSlice.reducer;
