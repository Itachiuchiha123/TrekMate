import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id || req.userId;
        const user = await User.findById(userId)
            .select("-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires")
            .populate("followers", "username profile_picture")
            .populate("following", "username profile_picture");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
export const updateUserProfile = async (req, res) => {
    try {
        const { name, bio, location, website } = req.body;
        const userId = req.userId;

        const user = await User.findByIdAndUpdate(
            userId,
            { name, bio, location, website },
            { new: true, runValidators: true }
        ).select("-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateAvatar = async (req, res) => {
    try {
        const { url, public_id } = req.body;
        if (!url || !public_id) {
            return res.status(400).json({ msg: "Missing avatar data" });
        }

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ msg: "User not found" });


        if (user.avatar?.public_id) {
            try {
                await cloudinary.uploader.destroy(user.avatar.public_id);
            } catch (err) {
                console.error("Failed to delete old avatar from Cloudinary:", err);
                // Optionally log but don’t block the update if this fails
            }
        }


        user.avatar = { url, public_id };
        await user.save();

        res.status(200).json({ avatar: user.avatar });
    } catch (err) {
        console.error("Avatar update failed:", err);
        res.status(500).json({ msg: "Avatar update failed" });
    }
};

export const getPublicProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select("-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isOwner = req.userId && req.userId.toString() === user._id.toString();

        let posts = [];

        if (!user.is_private || isOwner) {
            posts = await Post.find({ user: user._id })
                .sort({ createdAt: -1 })
                .limit(10)
        }
        res.status(200).json({
            profile: {
                _id: user._id,
                username: user.username,
                name: user.name,
                avatar: user.avatar,
                bio: user.bio,
                is_private: user.is_private,
                location: user.location,
                website: user.website,
                createdAt: user.createdAt,
                followers: user.followers,
                following: user.following,
            },
            posts,
            can_view_posts: !user.is_private || isOwner,
        });

    } catch (err) {
        console.error("Error fetching public profile:", err);
        res.status(500).json({ msg: "Server error" });
    }
}

export const followUser = async (req, res) => {
    const { id: targetUserId } = req.params;
    const currentUserId = req.userId;

    if (targetUserId === currentUserId) {
        return res.status(400).json({ msg: "You cannot follow yourself" });
    }

    try {
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ msg: "Target user not found" });
        }

        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ msg: "Current user not found" });
        }

        if (currentUser.following.includes(targetUserId)) {
            // Unfollow
            currentUser.following.pull(targetUserId);
            targetUser.followers.pull(currentUserId);
        } else {
            // Follow
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({
            success: true,
            message: currentUser.following.includes(targetUserId) ? "Followed successfully" : "Unfollowed successfully",
            followingCount: currentUser.following.length,
            followersCount: targetUser.followers.length,
        });
    } catch (error) {
        console.error("Error following/unfollowing user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}