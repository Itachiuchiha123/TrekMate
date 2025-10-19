import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import uploadReducer from './features/upload/uploadSlice';
import dashboardReducer from './features/dashboard/dashboardSlice';
import profileReducer from './features/public/profileSlice';
import followReducer from './features/follow/followSlice';
import postsReducer from './features/posts/postSlice';
import commentReducer from './features/comments/commentSlice';
import notificationReducer from './features/notification/notificationSlice';
import mediaauthReducer from './features/mediaAuth/mediaauthSlice';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage

// Only persist mediaAuth (you can persist more later if needed)
const mediaAuthPersistConfig = {
    key: "mediaAuth",
    storage,
};

const persistedMediaAuthReducer = persistReducer(
    mediaAuthPersistConfig,
    mediaauthReducer
);

export const store = configureStore({
    reducer: {
        auth: authReducer,
        upload: uploadReducer,
        dashboard: dashboardReducer,
        profile: profileReducer,
        follow: followReducer,
        posts: postsReducer,
        comments: commentReducer,
        notifications: notificationReducer,
        mediaauth: persistedMediaAuthReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // required for redux-persist
        }),
});
export const persistor = persistStore(store);
export default store;