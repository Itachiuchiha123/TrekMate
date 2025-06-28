import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import uploadReducer from './features/upload/uploadSlice';
import dashboardReducer from './features/dashboard/dashboardSlice';
import profileReducer from './features/public/profileSlice';
import followReducer from './features/follow/followSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        upload: uploadReducer,
        dashboard: dashboardReducer,
        profile: profileReducer,
        follow: followReducer
    },
});
export default store;