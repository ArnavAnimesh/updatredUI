// This is the main Redux Store. It combines all our slices into one central database.
// All the data for our app lives here.

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import startupReducer from './slices/startupSlice';

// We create the store and add our reducers to it.
const store = configureStore({
    reducer: {
        user: userReducer,
        startup: startupReducer
    }
});

export default store;
