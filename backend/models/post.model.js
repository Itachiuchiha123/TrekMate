import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    caption: {
        type: String,
        maxLength: [500, "Caption's max length hit"]
    },
    media_urls: [{
        type: String,
        required: true
    }],
    location: {
        type: String,
        required: false
    },
    is_public: {
        type: Boolean,
        default: true,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    likes_count: {
        type: Number,
        default: 0
    },
    comment_count: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }

});

const Post = mongoose.model("Post", postSchema);
export default Post;