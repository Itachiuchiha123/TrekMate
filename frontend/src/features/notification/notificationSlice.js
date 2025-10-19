// redux/slices/notificationSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true; // crucial for sending cookies

const API_URL = process.env.NODE_ENV === 'production'
    ? `${process.env.REACT_APP_BACKEND}`
    : 'http://localhost:5000';

export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/notifications`);
            // expects { success: true, notifications }
            if (response.data.success) {
                return response.data.notifications;
            } else {
                return rejectWithValue(response.data.message || "Failed to fetch notifications");
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch notifications");
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_URL}/api/notifications/${id}/read`,
                {} // <-- send empty body
            );
            if (response.data.success) {
                return id;
            } else {
                return rejectWithValue(response.data.message || "Failed to update notification");
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update notification");
        }
    }
);

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        list: [],
    },
    reducers: {
        addNotification: (state, action) => {
            state.list.unshift(action.payload); // new notification on top
        },
        clearNotifications: (state) => {
            state.list = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const idx = state.list.findIndex(n => n._id === action.payload);
                if (idx !== -1) state.list[idx].read = true;
            })
            .addCase(markNotificationAsRead.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
