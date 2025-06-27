// src/redux/slices/uploadSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NODE_ENV === "production"
    ? `${process.env.REACT_APP_BACKEND}/api/upload`
    : "http://localhost:5000/api/upload";

// 🔁 Async thunk for uploading media (image/video)
export const uploadMedia = createAsyncThunk(
    "upload/uploadMedia",
    async (file, thunkAPI) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(`${API_URL}`, formData, {
                onUploadProgress: (e) => {
                    const percent = Math.round((e.loaded * 100) / e.total);
                    thunkAPI.dispatch(setUploadProgress(percent));
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return res.data; // { url, public_id }
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.msg || "Upload failed"
            );
        }
    }
);


const initialState = {
    uploading: false,
    uploadProgress: 0,
    uploadedMedia: null,
    error: null,
};

const uploadSlice = createSlice({
    name: "upload",
    initialState,
    reducers: {
        resetUploadState: () => initialState,
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadMedia.pending, (state) => {
                state.uploading = true;
                state.error = null;
                state.uploadProgress = 0;
            })
            .addCase(uploadMedia.fulfilled, (state, action) => {
                state.uploading = false;
                state.uploadedMedia = action.payload;
                state.uploadProgress = 100;
            })
            .addCase(uploadMedia.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload;
                state.uploadProgress = 0;
            });
    },
});

export const { resetUploadState, setUploadProgress } = uploadSlice.actions;
export default uploadSlice.reducer;
