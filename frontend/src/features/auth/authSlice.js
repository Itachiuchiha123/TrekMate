import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.withCredentials = true;

const API_URL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_URL
    : "http://localhost:5000/api/auth";

const USER_API = process.env.NODE_ENV === "production"
    ? `${process.env.REACT_APP_BACKEND}`
    : "http://localhost:5000";

// Async thunks
export const signup = createAsyncThunk("auth/signup", async ({ email, password, name }, thunkAPI) => {
    try {
        const res = await axios.post(`${API_URL}/signup`, { email, password, name });
        return res.data.user;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.msg || "Error signing up");
    }
});

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (profileData, thunkAPI) => {
        try {
            const res = await axios.put(`${USER_API}/api/user/update`, profileData);
            return res.data.user;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.msg || "Failed to update profile"
            );
        }
    }
);

// 🖼️ Update Avatar
export const updateAvatar = createAsyncThunk(
    "auth/updateAvatar",
    async ({ url, public_id }, thunkAPI) => {
        try {
            const res = await axios.put(`${USER_API}/api/user/update-avatar`, { url, public_id });
            return res.data.avatar;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.msg || "Failed to update avatar"
            );
        }
    }
);

export const login = createAsyncThunk("auth/login", async ({ email, password }, thunkAPI) => {
    try {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        return res.data.user;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.msg || "Error logging in");
    }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
        await axios.post(`${API_URL}/logout`);
        return;
    } catch (err) {
        return thunkAPI.rejectWithValue("Error logging out");
    }
});

export const verifyEmail = createAsyncThunk("auth/verifyEmail", async (code, thunkAPI) => {
    try {
        const res = await axios.post(`${API_URL}/verify-email`, { code });
        return res.data.user;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.msg || "Error verifying email");
    }
});

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, thunkAPI) => {
    try {
        const res = await axios.get(`${API_URL}/check-auth`);
        return res.data.user;
    } catch (err) {
        return thunkAPI.rejectWithValue(null);
    }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, thunkAPI) => {
    try {
        const res = await axios.post(`${API_URL}/forgot-password`, { email });
        return res.data.message;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.msg || "Error sending reset email");
    }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ token, password }, thunkAPI) => {
    try {
        const res = await axios.post(`${API_URL}/reset-password/${token}`, { password });
        return res.data.message;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.msg || "Error resetting password");
    }
});

// Initial State
const initialState = {
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: true,
    isCheckingAuth: true,
    message: null,
    busy: false,
};

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Signup
        builder.addCase(signup.pending, (state) => {
            state.busy = true;
            state.error = null;
        });
        builder.addCase(signup.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.busy = false;

        });
        builder.addCase(signup.rejected, (state, action) => {
            state.error = action.payload;
            state.busy = false;
        });

        // Login
        builder.addCase(login.pending, (state) => {
            state.busy = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.busy = false;

        });
        builder.addCase(login.rejected, (state, action) => {
            state.error = action.payload;
            state.busy = false;
        });

        // Logout
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
        });

        // Verify Email
        builder.addCase(verifyEmail.pending, (state) => {
            state.busy = true;
        });
        builder.addCase(verifyEmail.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.busy = false;
        });
        builder.addCase(verifyEmail.rejected, (state, action) => {
            state.error = action.payload;
            state.busy = false;
        });

        // Check Auth
        builder.addCase(checkAuth.pending, (state) => {
            state.isCheckingAuth = true;
            state.isLoading = true;
        });
        builder.addCase(checkAuth.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isCheckingAuth = false;
            state.isLoading = false;
        });
        builder.addCase(checkAuth.rejected, (state) => {
            state.isAuthenticated = false;
            state.isCheckingAuth = false;
            state.isLoading = false;
        });

        // Forgot Password
        builder.addCase(forgotPassword.pending, (state) => {
            state.busy = true;
        });
        builder.addCase(forgotPassword.fulfilled, (state, action) => {
            state.message = action.payload;
            state.busy = false;
        });
        builder.addCase(forgotPassword.rejected, (state, action) => {
            state.error = action.payload;
            state.busy = false;
        });

        // Reset Password
        builder.addCase(resetPassword.pending, (state) => {
            state.busy = true;
        });
        builder.addCase(resetPassword.fulfilled, (state, action) => {
            state.message = action.payload;
            state.busy = false;
        });
        builder.addCase(resetPassword.rejected, (state, action) => {
            state.error = action.payload;
            state.busy = false;
        });

        // 🔁 Update Profile
        builder.addCase(updateProfile.pending, (state) => {

        });
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            state.user = action.payload;

        });
        builder.addCase(updateProfile.rejected, (state, action) => {
            state.error = action.payload;

        });

        // 🖼️ Update Avatar
        builder.addCase(updateAvatar.pending, (state) => {

        });
        builder.addCase(updateAvatar.fulfilled, (state, action) => {
            if (state.user) {
                state.user.avatar = action.payload;
            }

        });
        builder.addCase(updateAvatar.rejected, (state, action) => {
            state.error = action.payload;

        });
    }

});

export default authSlice.reducer;
