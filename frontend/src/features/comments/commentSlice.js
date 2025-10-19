import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = process.env.NODE_ENV === 'production'
    ? `${process.env.REACT_APP_BACKEND}`
    : 'http://localhost:5000';


// Fetch all comments for a post (nested)
export const fetchCommentsByPost = createAsyncThunk(
    "comments/fetchByPost",
    async (postId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}/api/comments/post/${postId}`);
            return res.data.comments;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch comments");
        }
    }
);

// Create a comment or reply
export const createComment = createAsyncThunk(
    "comments/create",
    async ({ postId, content, parentComment }, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${API_URL}/api/comments/`,
                { postId, content, parentComment },
            );
            return res.data.comment;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to create comment");
        }
    }
);

// Delete a comment (and its replies)
export const deleteComment = createAsyncThunk(
    "comments/delete",
    async (commentId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/api/comments/${commentId}`);
            return commentId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to delete comment");
        }
    }
);

// Toggle like/unlike on a comment
export const toggleCommentLike = createAsyncThunk(
    "comments/toggleLike",
    async (commentId, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${API_URL}/api/comments/${commentId}/like`,
                {}
            );
            return { commentId, liked: res.data.liked };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to toggle like");
        }
    }
);

const commentSlice = createSlice({
    name: "comments",
    initialState: {
        comments: [],
        loading: false,
        error: null,
        createLoading: false,
        createError: null,
        deleteLoading: false,
        deleteError: null,
        likeLoading: false,
        likeError: null,
    },
    reducers: {
        clearCommentErrors: (state) => {
            state.error = null;
            state.createError = null;
            state.deleteError = null;
            state.likeError = null;
        },
        resetComments: (state) => {
            state.comments = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch comments
            .addCase(fetchCommentsByPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCommentsByPost.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
            })
            .addCase(fetchCommentsByPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create comment
            .addCase(createComment.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.createLoading = false;
                // Optionally, you can refetch comments or push the new comment
            })
            .addCase(createComment.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload;
            })
            // Delete comment
            .addCase(deleteComment.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.deleteLoading = false;
                // Optionally, you can refetch comments or remove the deleted comment
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload;
            })
            // Toggle like
            .addCase(toggleCommentLike.pending, (state) => {
                state.likeLoading = true;
                state.likeError = null;
            })
            .addCase(toggleCommentLike.fulfilled, (state, action) => {
                state.likeLoading = false;
                // Optionally, you can update the like state in comments
            })
            .addCase(toggleCommentLike.rejected, (state, action) => {
                state.likeLoading = false;
                state.likeError = action.payload;
            });
    },
});

export const { clearCommentErrors, resetComments } = commentSlice.actions;
export default commentSlice.reducer;