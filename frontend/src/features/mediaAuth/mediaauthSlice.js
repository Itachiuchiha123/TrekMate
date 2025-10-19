// features/mediaAuth/mediaauthSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = process.env.NODE_ENV === 'production'
    ? `${process.env.REACT_APP_BACKEND}`
    : 'http://localhost:5000';

// Thunk to fetch a signed media URL
export const fetchMediaAuthUrl = createAsyncThunk(
    "mediaauth/fetchMediaAuthUrl",
    async ({ publicId, type = "image" }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/media`, {
                params: { publicId, type },
            });
            if (response.data.success) {
                return { publicId, ...response.data };
            } else {
                return rejectWithValue(response.data.error || "Failed to fetch media URL");
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || "Failed to fetch media URL");
        }
    }
);

// Initial state stores all media by publicId
const initialState = {
    media: {} // { [publicId]: { url, type, loading, error } }
};

const mediaauthSlice = createSlice({
    name: "mediaauth",
    initialState,
    reducers: {
        clearMediaAuth: (state) => {
            state.media = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMediaAuthUrl.pending, (state, action) => {
                const { publicId } = action.meta.arg;
                state.media[publicId] = {
                    ...(state.media[publicId] || {}),
                    loading: true,
                    error: null,
                };
            })
            .addCase(fetchMediaAuthUrl.fulfilled, (state, action) => {
                const { publicId, url, resource_type, expiresAt } = action.payload;
                state.media[publicId] = {
                    url,
                    type: resource_type,
                    expiresAt,
                    loading: false,
                    error: null,
                };
            })
            .addCase(fetchMediaAuthUrl.rejected, (state, action) => {
                const { publicId } = action.meta.arg;
                state.media[publicId] = {
                    ...(state.media[publicId] || {}),
                    loading: false,
                    error: action.payload || "Failed to fetch",
                };
            });
    },
});

export const { clearMediaAuth } = mediaauthSlice.actions;
export default mediaauthSlice.reducer;
