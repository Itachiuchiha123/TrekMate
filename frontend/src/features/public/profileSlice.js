// redux/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.withCredentials = true;

const API_URL = process.env.NODE_ENV === 'production'
    ? `${process.env.REACT_APP_BACKEND_URL}/api/user`
    : 'http://localhost:5000/api/user';

// Async thunk to fetch public profile
export const fetchPublicProfile = createAsyncThunk(
    'profile/fetchPublicProfile',
    async (username, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/public/${username}`);

            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.msg || 'Failed to fetch profile'
            );
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPublicProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchPublicProfile.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
