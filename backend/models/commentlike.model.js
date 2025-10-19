import mongoose from "mongoose";

const CommentLikeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
}, { timestamps: true });

CommentLikeSchema.index({ user: 1, comment: 1 }, { unique: true });

export const CommentLike = mongoose.model("CommentLike", CommentLikeSchema);
