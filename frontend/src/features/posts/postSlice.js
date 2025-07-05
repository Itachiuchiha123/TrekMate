import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;
// Set base URL for axios
axios.defaults.baseURL = process.env.NODE_ENV === 'production'
    ? `${process.env.REACT_APP_BACKEND}`
    : 'http://localhost:5000';


// Fetch paginated feed
export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async ({ page = 1 }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/api/posts/feed?page=${page}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch posts");
        }
    }
);

// Create post
export const createPost = createAsyncThunk(
    "posts/createPost",
    async (postData, { rejectWithValue }) => {
        try {
            const res = await axios.post("/api/posts", postData);
            return res.data.post;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to create post");
        }
    }
);

// Delete post
export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (postId, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/posts/${postId}`);
            return postId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to delete post");
        }
    }
);

// Update post
export const updatePost = createAsyncThunk(
    "posts/updatePost",
    async ({ postId, updatedData }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`/api/posts/${postId}`, updatedData);
            return res.data.post;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update post");
        }
    }
);

// Toggle like
export const toggleLike = createAsyncThunk(
    "posts/toggleLike",
    async (postId, { rejectWithValue }) => {
        try {
            const res = await axios.post(`/api/posts/${postId}/like`);
            return { postId, liked: res.data.liked };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to toggle like");
        }
    }
);

// Get post by ID
export const getPostById = createAsyncThunk(
    "posts/getPostById",
    async (postId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/api/posts/${postId}`);
            return res.data.post;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch post");
        }
    }
);

// Upload post media
export const uploadPostMedia = createAsyncThunk(
    "posts/uploadPostMedia",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                "/api/postmedia/upload-media",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return res.data.media; // array of uploaded media objects
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to upload media");
        }
    }
);

// Fetch posts by user ID
export const fetchUserPosts = createAsyncThunk(
    "posts/fetchUserPosts",
    async ({ page = 1 }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/api/posts/userposts?page=${page}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch user's posts");
        }
    }
);

const postSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [],
        singlePost: null,
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        mediaUploading: false,
        mediaUploadError: null,
        uploadedMedia: [],
        userPosts: [],
        userPostsLoading: false,
        userPostsError: null,
        userPostsCurrentPage: 1,
        userPostsTotalPages: 1,
        userPostsTotal: 0,
    },
    reducers: {
        clearPosts: (state) => {
            state.posts = [];
            state.currentPage = 1;
            state.totalPages = 1;
            state.totalPosts = 0;
            state.error = null;
        },
        clearUserPosts: (state) => {
            state.userPosts = [];
            state.userPostsCurrentPage = 1;
            state.userPostsTotalPages = 1;
            state.userPostsTotal = 0;
            state.userPostsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Posts
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                const { posts, currentPage, totalPages, totalPosts } = action.payload;
                state.posts = currentPage === 1 ? posts : [...state.posts, ...posts];
                state.currentPage = currentPage;
                state.totalPages = totalPages;
                state.totalPosts = totalPosts;
                state.loading = false;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Post
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts = [action.payload, ...state.posts];
            })

            // Delete Post
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter((post) => post._id !== action.payload);
            })

            // Update Post
            .addCase(updatePost.fulfilled, (state, action) => {
                state.posts = state.posts.map((post) =>
                    post._id === action.payload._id ? action.payload : post
                );
            })

            // Toggle Like
            .addCase(toggleLike.fulfilled, (state, action) => {
                const { postId, liked } = action.payload;
                const post = state.posts.find((p) => p._id === postId);
                if (post) {
                    post.liked = liked;
                    post.likes_count += liked ? 1 : -1;
                }
                // Also update in userPosts if present
                const userPost = state.userPosts.find((p) => p._id === postId);
                if (userPost) {
                    userPost.liked = liked;
                    userPost.likes_count += liked ? 1 : -1;
                }
            })

            // Get Post by ID
            .addCase(getPostById.pending, (state) => {
                state.loading = true;
                state.singlePost = null;
                state.error = null;
            })
            .addCase(getPostById.fulfilled, (state, action) => {
                state.loading = false;
                state.singlePost = action.payload;
            })
            .addCase(getPostById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Upload Post Media
            .addCase(uploadPostMedia.pending, (state) => {
                state.mediaUploading = true;
                state.mediaUploadError = null;
                state.uploadedMedia = [];
            })
            .addCase(uploadPostMedia.fulfilled, (state, action) => {
                state.mediaUploading = false;
                state.uploadedMedia = action.payload;
            })
            .addCase(uploadPostMedia.rejected, (state, action) => {
                state.mediaUploading = false;
                state.mediaUploadError = action.payload;
            })

            // Fetch User Posts
            .addCase(fetchUserPosts.pending, (state) => {
                state.userPostsLoading = true;
                state.userPostsError = null;
            })
            .addCase(fetchUserPosts.fulfilled, (state, action) => {
                const { posts, currentPage, totalPages, totalPosts } = action.payload;
                state.userPosts = currentPage === 1 ? posts : [...state.userPosts, ...posts];
                state.userPostsCurrentPage = currentPage;
                state.userPostsTotalPages = totalPages;
                state.userPostsTotal = totalPosts;
                state.userPostsLoading = false;
            })
            .addCase(fetchUserPosts.rejected, (state, action) => {
                state.userPostsLoading = false;
                state.userPostsError = action.payload;
            });
    },
});

export const { clearPosts, clearUserPosts } = postSlice.actions;

export default postSlice.reducer;
