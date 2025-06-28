import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.withCredentials = true;
const API_URL = process.env.NODE_ENV === 'production'
    ? `${process.env.REACT_APP_BACKEND}`
    : 'http://localhost:5000';

// Async thunk to follow a user
export const toggleFollowUser = createAsyncThunk(
    "follow/toggleFollowUser",
    async (targetUserId, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${API_URL}/api/user/follow/${targetUserId}`,
                {},
            );
            return { targetUserId, ...res.data };
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Something went wrong" });
        }
    }
);

const followSlice = createSlice({
    name: "follow",
    initialState: {
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearFollowMessage: (state) => {
            state.successMessage = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(toggleFollowUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(toggleFollowUser.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(toggleFollowUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearFollowMessage } = followSlice.actions;
export default followSlice.reducer;
