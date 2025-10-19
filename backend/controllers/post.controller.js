import Post from "../models/post.model.js";


export const createPost = async (req, res) => {
    try {
        const { caption, media_urls, location, is_public, tags } = req.body;
        const user = req.userId;

        if (!caption || !media_urls || !user) {
            return res.status(400).json({
                success: false,
                message: "Caption, media_urls and user are required"
            });
        }

        const post = await Post.create({
            user,
            caption,
            media_urls,
            location,
            is_public,
            tags
        })

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        });


    } catch {

        console.error("Error Creating Post: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });

    }
}

export const getPosts = async (req, res) => {

    try {
        const limit = parseInt(req.query.limit) || 10;
        const cursor = req.query.cursor;

        let query = { is_public: true };

        if (cursor) {
            query.created_at = { $lt: new Date(cursor) };
        }

        const posts = await Post.find(query)
            .sort({ created_at: -1 })
            .limit(limit)
            .populate("user", "username profile_picture")

        res.json({
            success: true,
            posts,
            nextCursor: posts.length === limit ? posts[posts.length - 1].created_at : null
        });


    } catch {
        console.error("Error Fetching Posts: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });

    }
}

export const LikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        post.likes_count += 1;
        await post.save();
        res.json({
            success: true,
            message: "Post liked successfully",
            post
        });


    } catch {

        console.error("Error Liking Post: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });

    }
}


// Delete Post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await post.remove();
        res.json({ message: "Post deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};