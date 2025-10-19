import express from "express";
import {
    createPost,
    getFeed,
    getPostById,
    deletePost,
    updatePost,
    togglePostLike, getPostsByUserId
} from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";


const postrouter = express.Router();

// Create a post (POST /api/posts)
postrouter.post("/", verifyToken, createPost);

// Get paginated feed (GET /api/posts/feed?page=1)
postrouter.get("/feed", verifyToken, getFeed);

// Get posts by user ID (GET /api/posts/user/:userId?page=1)
postrouter.get("/userposts", verifyToken, getPostsByUserId);

// Get single post by ID (GET /api/posts/:id)
postrouter.get("/:id", verifyToken, getPostById);

// Delete a post (DELETE /api/posts/:id)
postrouter.delete("/:id", verifyToken, deletePost);

// Update a post (PATCH /api/posts/:id)
postrouter.patch("/:id", verifyToken, updatePost);

// Toggle like/unlike (POST /api/posts/:id/like)
postrouter.post("/:id/like", verifyToken, togglePostLike);

export default postrouter;
