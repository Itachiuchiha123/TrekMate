import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
        isVerfied: {
            type: Boolean,
            default: false,
        },
        avatar: {
            public_id: {
                type: String,
                default: "", // nothing uploaded yet
            },
            url: {
                type: String,
                default: "", // or a default avatar URL if you prefer
            },
        },
        bio: {
            type: String,
            maxlength: 160,
            default: "",
        },
        location: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        },

        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        // models/User.js
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 3,
            maxlength: 30,
            match: /^[a-zA-Z0-9_]+$/,
        },

        is_private: {
            type: Boolean,
            default: false,
        },

        resetPasswordToken: String,
        resetPasswordExpires: Date,
        verificationToken: String,
        verificationTokenExpires: Date,
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;
