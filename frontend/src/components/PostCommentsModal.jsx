import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { timeAgo } from "../libs/utils";
import MediaSlider from "./MediaSlider";
import {
  fetchCommentsByPost,
  createComment,
  toggleCommentLike,
  deleteComment,
} from "../features/comments/commentSlice";

const PostCommentsModal = ({ post, onClose }) => {
  if (!post) return null;
  const [mediaIdx, setMediaIdx] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const dispatch = useDispatch();
  const { comments, loading, createLoading, likeLoading } = useSelector(
    (state) => state.comments
  );
  const { user: currentUser, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const medias = Array.isArray(post.media_urls) ? post.media_urls : [];

  useEffect(() => {
    if (post?._id) {
      dispatch(fetchCommentsByPost(post._id));
    }
  }, [post?._id, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await dispatch(
      createComment({
        postId: post._id,
        content: commentText,
        parentComment: replyTo,
      })
    );
    setCommentText("");
    setReplyTo(null);
    dispatch(fetchCommentsByPost(post._id));
  };

  const handleReply = (commentOrReply) => {
    setReplyTo(commentOrReply);
    const mention = `@${
      commentOrReply.user?.username || commentOrReply.user?.name || "user"
    } `;
    if (!commentText.startsWith(mention)) {
      setCommentText(mention);
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const flattenReplies = (replies) => {
    let flat = [];
    for (const reply of replies || []) {
      flat.push(reply);
      if (reply.replies && reply.replies.length > 0) {
        flat = flat.concat(flattenReplies(reply.replies));
      }
    }
    return flat;
  };

  const renderComments = (commentsList) => {
    if (!commentsList || !commentsList.length) return null;
    return commentsList.map((comment) => {
      const hasReplies = comment.replies && comment.replies.length > 0;
      const isExpanded = expandedReplies[comment._id] || false;
      return (
        <div key={comment._id} className="mb-4">
          <div className="flex items-start gap-2">
            <img
              src={comment.user?.avatar?.url || "/trekker-avatar.png"}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm truncate">
                  {comment.user?.name}
                </span>
                <span className="text-xs text-neutral-400">
                  {comment.created_at ? timeAgo(comment.created_at) : ""}
                </span>
                {isAuthenticated && currentUser?._id === comment.user?._id && (
                  <button
                    className="ml-2 text-xs text-red-500 hover:underline"
                    onClick={async () => {
                      await dispatch(deleteComment(comment._id));
                      dispatch(fetchCommentsByPost(post._id));
                    }}
                    disabled={likeLoading}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="text-sm text-black dark:text-white mb-1 break-words">
                {comment.content}
              </div>
              <div className="flex items-center gap-3 text-xs mt-1">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleReply(comment)}
                  disabled={!isAuthenticated}
                >
                  Reply
                </button>
                <button
                  className={`hover:text-blue-600 ${
                    comment.likedByCurrentUser
                      ? "text-blue-600"
                      : "text-neutral-500"
                  }`}
                  onClick={() =>
                    dispatch(toggleCommentLike(comment._id)).then(() =>
                      dispatch(fetchCommentsByPost(post._id))
                    )
                  }
                  disabled={likeLoading || !isAuthenticated}
                >
                  {comment.likes_count || 0} Like
                  {comment.likes_count === 1 ? "" : "s"}
                </button>
                {hasReplies && (
                  <button
                    className="text-xs text-blue-400 hover:underline ml-2"
                    onClick={() => toggleReplies(comment._id)}
                  >
                    {isExpanded
                      ? `Hide replies (${
                          flattenReplies(comment.replies).length
                        })`
                      : `View replies (${
                          flattenReplies(comment.replies).length
                        })`}
                  </button>
                )}
              </div>
              {hasReplies && isExpanded && (
                <div className="mt-2">
                  {flattenReplies(comment.replies).map((reply) => (
                    <div
                      key={reply._id}
                      className="flex items-start gap-2 ml-8 mb-3 border-l-2 border-neutral-200 dark:border-neutral-700 pl-3"
                    >
                      <img
                        src={reply.user?.avatar?.url || "/trekker-avatar.png"}
                        alt="avatar"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-xs truncate">
                            {reply.user?.name}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {reply.created_at ? timeAgo(reply.created_at) : ""}
                          </span>
                          {isAuthenticated &&
                            currentUser?._id === reply.user?._id && (
                              <button
                                className="ml-2 text-xs text-red-500 hover:underline"
                                onClick={async () => {
                                  await dispatch(deleteComment(reply._id));
                                  dispatch(fetchCommentsByPost(post._id));
                                }}
                                disabled={likeLoading}
                              >
                                Delete
                              </button>
                            )}
                        </div>
                        <div className="text-xs text-black dark:text-white mb-1 break-words">
                          {reply.content}
                        </div>
                        <div className="flex items-center gap-3 text-xs mt-1">
                          <button
                            className="text-blue-500 hover:underline"
                            onClick={() => handleReply(reply)}
                            disabled={!isAuthenticated}
                          >
                            Reply
                          </button>
                          <button
                            className={`hover:text-blue-600 ${
                              reply.likedByCurrentUser
                                ? "text-blue-600"
                                : "text-neutral-500"
                            }`}
                            onClick={() =>
                              dispatch(toggleCommentLike(reply._id)).then(() =>
                                dispatch(fetchCommentsByPost(post._id))
                              )
                            }
                            disabled={likeLoading || !isAuthenticated}
                          >
                            {reply.likes_count || 0} Like
                            {reply.likes_count === 1 ? "" : "s"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg w-full h-full sm:h-auto max-w-2xl flex flex-col sm:flex-row overflow-hidden relative">
        <div className="w-full sm:w-1/2 flex items-center justify-center bg-black min-h-[220px] sm:min-h-[400px] h-[250px] sm:h-auto">
          {medias.length > 0 ? (
            <MediaSlider
              medias={medias}
              currentIdx={mediaIdx}
              onPrev={() =>
                setMediaIdx((prev) => (prev > 0 ? prev - 1 : medias.length - 1))
              }
              onNext={() =>
                setMediaIdx((prev) => (prev < medias.length - 1 ? prev + 1 : 0))
              }
              setIdx={setMediaIdx}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-neutral-400 text-4xl bg-neutral-100 dark:bg-neutral-900">
              <span>📷</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col p-3 sm:p-4 min-w-0 w-full max-w-full sm:min-w-[400px] sm:max-w-[500px] bg-white dark:bg-neutral-900 max-h-full sm:max-h-[90vh] overflow-hidden">
          <button
            className="absolute top-2 right-2 text-neutral-500 hover:text-red-500 text-3xl sm:text-2xl font-bold w-10 h-10 flex items-center justify-center sm:w-auto sm:h-auto z-10"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>

          <div className="flex items-center gap-2 mb-2 sm:mb-4">
            <img
              src={post.user?.avatar?.url || "/trekker-avatar.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm sm:text-base">
              {post.user?.name}
            </span>
            <span className="text-xs text-neutral-400 ml-2">
              {post.createdAt ? timeAgo(post.createdAt) : ""}
            </span>
          </div>

          <div className="text-sm sm:text-base text-black dark:text-white mb-2 sm:mb-4 whitespace-pre-wrap break-words">
            {post.caption}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto border-t border-neutral-200 dark:border-neutral-800 pt-2 mb-2 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700">
            {loading ? (
              <div className="text-neutral-500 text-center mt-8">
                Loading comments...
              </div>
            ) : comments && comments.length > 0 ? (
              renderComments(comments)
            ) : (
              <div className="text-neutral-500 text-center mt-8">
                No comments yet.
              </div>
            )}
          </div>

          <form
            className="flex flex-col gap-2 border-t border-neutral-200 dark:border-neutral-800 pt-2 mt-1"
            onSubmit={handleSubmit}
          >
            {replyTo && (
              <div className="flex items-center justify-between text-xs bg-blue-100 dark:bg-blue-900 text-blue-500 px-3 py-1 rounded-full">
                <span className="truncate">
                  Replying to @
                  {replyTo?.user?.username || replyTo?.user?.name || "user"}
                </span>
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => {
                    const mention = `@${
                      replyTo?.user?.username || replyTo?.user?.name || "user"
                    } `;
                    if (commentText.startsWith(mention)) setCommentText("");
                    setReplyTo(null);
                  }}
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex gap-2 items-end">
              <input
                type="text"
                className="flex-1 min-w-0 rounded-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white outline-none text-sm sm:text-base"
                placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={!isAuthenticated || createLoading}
              />
              <button
                type="submit"
                className="text-blue-500 font-semibold text-sm sm:text-base px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition flex-shrink-0"
                disabled={
                  !isAuthenticated || createLoading || !commentText.trim()
                }
              >
                {createLoading ? "Posting..." : replyTo ? "Reply" : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostCommentsModal;
