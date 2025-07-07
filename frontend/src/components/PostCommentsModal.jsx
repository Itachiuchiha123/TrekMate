import React, { useState } from "react";
import { timeAgo } from "../libs/utils";
import MediaSlider from "./MediaSlider";

const PostCommentsModal = ({ post, onClose }) => {
  if (!post) return null;
  const [mediaIdx, setMediaIdx] = useState(0);
  const medias = Array.isArray(post.media_urls) ? post.media_urls : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg max-w-2xl w-full flex flex-col md:flex-row overflow-hidden relative">
        {/* Media */}
        <div className="flex-1 flex items-center justify-center bg-black min-h-[400px] md:min-h-[600px]">
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
        {/* Comments Section */}
        <div className="flex-1 flex flex-col p-4 min-w-[300px] max-w-[400px]">
          <button
            className="absolute top-2 right-2 text-neutral-500 hover:text-red-500 text-2xl font-bold"
            onClick={onClose}
          >
            ×
          </button>
          <div className="flex items-center gap-2 mb-4">
            <img
              src={post.user?.avatar?.url || "/trekker-avatar.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-semibold text-neutral-800 dark:text-neutral-100">
              {post.user?.name}
            </span>
            <span className="text-xs text-neutral-400 ml-2">
              {post.createdAt ? timeAgo(post.createdAt) : ""}
            </span>
          </div>
          <div className="text-base text-black dark:text-white mb-4 whitespace-pre-wrap">
            {post.caption}
          </div>
          <div className="flex-1 overflow-y-auto border-t border-neutral-200 dark:border-neutral-800 pt-2 mb-2">
            {/* TODO: Render comments here */}
            <div className="text-neutral-500 text-center mt-8">
              No comments yet.
            </div>
          </div>
          <form className="flex items-center gap-2 border-t border-neutral-200 dark:border-neutral-800 pt-2">
            <input
              type="text"
              className="flex-1 rounded-full px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white outline-none"
              placeholder="Add a comment..."
              disabled
            />
            <button
              type="submit"
              className="text-blue-500 font-semibold"
              disabled
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostCommentsModal;
