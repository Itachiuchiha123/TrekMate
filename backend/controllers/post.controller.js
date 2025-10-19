import cloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import PostLike from "../models/postlike.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { caption, media_urls, location, is_public, tags } = req.body;
        const user = req.userId;

        if (!caption || !media_urls || !user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "Caption, media_urls and user are required"
            });
        }

        const post = await Post.create([{ user, caption, media_urls, location, is_public, tags }], { session });

        await User.findByIdAndUpdate(
            user,
            { $push: { posts: post[0]._id } },
            { new: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: post[0]
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error Creating Post: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getFeed = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const userId = req.userId;

        const [posts, totalPosts] = await Promise.all([
            Post.find({ is_public: true })
                .populate("user", "username avatar name")
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),
            Post.countDocuments({ is_public: true }),
        ]);

        // Get post IDs
        const postIds = posts.map(p => p._id);

        // Find which posts are liked by the user
        const likedDocs = await PostLike.find({ post: { $in: postIds }, user: userId }).select("post");
        const likedPostIds = new Set(likedDocs.map(doc => doc.post.toString()));

        // Annotate each post with liked: true/false
        const postsWithLiked = posts.map(post => {
            const postObj = post.toObject();
            postObj.liked = likedPostIds.has(post._id.toString());
            return postObj;
        });

        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({
            success: true,
            posts: postsWithLiked,
            currentPage: page,
            totalPages,
            totalPosts,
        });
    } catch (error) {
        console.error("Error fetching feed:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching feed.",
        });
    }
};


export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("user", "username avatar name");
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        res.status(200).json({ success: true, post });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

export const getPostsByUserId = async (req, res) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const [posts, totalPosts] = await Promise.all([
            Post.find({ user: userId })
                .populate("user", "username avatar name")
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit),
            Post.countDocuments({ user: userId }),
        ]);

        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({
            success: true,
            posts,
            currentPage: page,
            totalPages,
            totalPosts,
        });
    } catch (error) {
        console.error("Error fetching user's posts:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching user's posts.",
        });
    }
};

export const deletePost = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const post = await Post.findById(req.params.id).session(session);
        if (!post || post.user.toString() !== req.userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: "Unauthorized or post not found." });
        }

        if (post.media_urls && post.media_urls.length > 0) {
            for (const media of post.media_urls) {
                if (media.public_id) {
                    await cloudinary.v2.uploader.destroy(media.public_id);
                }
            }
        }

        await post.deleteOne({ session });
        await User.findByIdAndUpdate(post.user, { $pull: { posts: post._id } }, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: "Post deleted successfully." });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error deleting post:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

export const updatePost = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { caption, location, tags, is_public, media_urls } = req.body;
        const post = await Post.findById(req.params.id).session(session);

        if (!post || post.user.toString() !== req.userId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: "Unauthorized or post not found." });
        }

        if (caption !== undefined) post.caption = caption;
        if (location !== undefined) post.location = location;
        if (tags !== undefined) post.tags = tags;
        if (is_public !== undefined) post.is_public = is_public;

        if (media_urls !== undefined) {
            const oldMediaIds = post.media_urls ? post.media_urls.map(m => m.public_id) : [];
            const newMediaIds = media_urls.map(m => m.public_id);

            const mediaToDelete = oldMediaIds.filter(id => !newMediaIds.includes(id));

            for (const public_id of mediaToDelete) {
                if (public_id) {
                    await cloudinary.v2.uploader.destroy(public_id);
                }
            }

            post.media_urls = media_urls;
        }

        post.updated_at = Date.now();
        await post.save({ session });

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ success: true, post });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error updating post:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

export const togglePostLike = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userId = req.userId;
        const postId = req.params.id;

        const existingLike = await PostLike.findOne({ post: postId, user: userId }).session(session);

        if (existingLike) {
            await existingLike.deleteOne({ session });
            await Post.findByIdAndUpdate(
                postId,
                { $inc: { likes_count: -1 }, $pull: { likes: userId } },
                { session }
            );
            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({ success: true, liked: false });
        } else {
            await PostLike.create([{ post: postId, user: userId }], { session });
            await Post.findByIdAndUpdate(
                postId,
                { $inc: { likes_count: 1 }, $addToSet: { likes: userId } },
                { session }
            );
            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({ success: true, liked: true });
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error toggling like:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};
