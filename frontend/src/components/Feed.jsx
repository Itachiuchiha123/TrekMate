import {
  Heart,
  Heart as HeartFilled,
  MessageCircle,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PostCommentsModal from "./PostCommentsModal";
import { toggleLike } from "../features/posts/postSlice";
import { timeAgo } from "../libs/utils";

const Feed = ({ posts, postsLoading }) => {
  // For media slider
  const [mediaIndex, setMediaIndex] = useState({});
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [modalPost, setModalPost] = useState(null);
  const [likeLoading, setLikeLoading] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePrev = (postIdx, mediaLen) => {
    setMediaIndex((prev) => ({
      ...prev,
      [postIdx]: prev[postIdx] > 0 ? prev[postIdx] - 1 : mediaLen - 1,
    }));
  };
  const handleNext = (postIdx, mediaLen) => {
    setMediaIndex((prev) => ({
      ...prev,
      [postIdx]: prev[postIdx] < mediaLen - 1 ? prev[postIdx] + 1 : 0,
    }));
  };

  useEffect(() => {
    if (openCommentsPostId) {
      const post = posts.find((p) => p._id === openCommentsPostId);
      setModalPost(post);
    } else {
      setModalPost(null);
    }
  }, [openCommentsPostId, posts]);

  const handleLike = async (postId) => {
    setLikeLoading((prev) => ({ ...prev, [postId]: true }));
    try {
      await dispatch(toggleLike(postId));
    } finally {
      setLikeLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {postsLoading || posts.length === 0 ? (
        <>
          <div className="h-24 w-full max-w-3xl rounded-xl bg-gray-100 dark:bg-neutral-800 animate-pulse mx-auto"></div>
          <div className="h-64 w-full max-w-3xl rounded-xl bg-gray-100 dark:bg-neutral-800 animate-pulse mx-auto"></div>
          {posts.length === 0 && !postsLoading && (
            <div className="text-neutral-500 text-center w-full max-w-3xl mx-auto">
              No posts yet.
            </div>
          )}
        </>
      ) : (
        posts.map((p, idx) => {
          const medias = Array.isArray(p.media_urls) ? p.media_urls : [];
          const currentIdx = mediaIndex[idx] || 0;
          return (
            <div
              key={p._id || idx}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow p-0 flex flex-col w-full max-w-3xl mx-auto"
            >
              {/* Header: Avatar, Name, Username, Time */}
              <div className="flex items-center gap-3 px-6 pt-4 pb-2">
                <img
                  src={p.user?.avatar?.url || "/trekker-avatar.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
                />
                <div className="flex flex-col">
                  <span
                    className="font-semibold text-black dark:text-white leading-tight"
                    onClick={() => navigate(`/profile/${p.user?.username}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {p.user?.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono leading-tight">
                    @{p.user?.username || "user"}
                  </span>
                </div>
                <span className="ml-auto text-xs text-neutral-400">
                  {p.createdAt ? timeAgo(p.createdAt) : ""}
                </span>
              </div>
              {/* Caption/Text */}
              {p.caption && (
                <div className="text-base text-black dark:text-white whitespace-pre-wrap px-6 pb-2">
                  {p.caption}
                </div>
              )}
              {/* Media Slider */}
              {medias.length > 0 && (
                <div className="w-full flex flex-col items-center bg-black/90 px-0 py-2 relative">
                  <div className="relative w-full flex justify-center">
                    {medias.map(
                      (url, i) =>
                        i === currentIdx &&
                        (url.match(/\.(mp4|webm|ogg)$/i) ? (
                          <div
                            key={i}
                            className="rounded-xl border border-neutral-300 dark:border-neutral-700 overflow-hidden w-full max-w-2xl mx-auto mb-2 bg-black"
                          >
                            <video
                              src={url}
                              controls
                              className="w-full max-h-[600px] object-contain bg-black"
                              style={{ display: "block" }}
                            />
                          </div>
                        ) : (
                          <div
                            key={i}
                            className="rounded-xl border border-neutral-300 dark:border-neutral-700 overflow-hidden w-full max-w-2xl mx-auto mb-2 bg-black"
                          >
                            <img
                              src={url}
                              alt="Post Media"
                              className="w-full max-h-[600px] object-contain bg-black"
                              style={{ display: "block" }}
                            />
                          </div>
                        ))
                    )}
                    {medias.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => handlePrev(idx, medias.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 z-10 hover:bg-black"
                          aria-label="Previous"
                        >
                          &#8592;
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNext(idx, medias.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 z-10 hover:bg-black"
                          aria-label="Next"
                        >
                          &#8594;
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {medias.map((_, i) => (
                            <span
                              key={i}
                              className={`inline-block w-2 h-2 rounded-full ${
                                i === currentIdx ? "bg-blue-500" : "bg-gray-400"
                              } opacity-80`}
                            ></span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              {/* Location & Tags */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 px-6 pt-2">
                {p.location && <span>📍 {p.location}</span>}
                {p.tags && p.tags.length > 0 && (
                  <span>
                    {p.tags.map((tag, i) => (
                      <span key={i} className="text-blue-500 mr-1">
                        #{tag}
                      </span>
                    ))}
                  </span>
                )}
              </div>
              {/* Actions: Like, Comment, Share */}
              <div className="flex items-center gap-8 pt-2 pb-2 px-6 border-t border-neutral-200 dark:border-neutral-800 mt-2">
                <button
                  type="button"
                  className={`flex items-center gap-1 transition ${
                    p.liked
                      ? "text-pink-500"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-pink-500"
                  } ${
                    likeLoading[p._id] ? "opacity-60 pointer-events-none" : ""
                  }`}
                  onClick={() => handleLike(p._id)}
                  disabled={likeLoading[p._id]}
                >
                  {p.liked ? (
                    <HeartFilled size={18} fill="#ec4899" stroke="#ec4899" />
                  ) : (
                    <Heart size={18} />
                  )}
                  <span className="text-sm">{p.likes_count || 0}</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-blue-500 transition"
                  onClick={() => setOpenCommentsPostId(p._id)}
                >
                  <MessageCircle size={18} />
                  <span className="text-sm">{p.comment_count || 0}</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-green-500 transition"
                >
                  <Share2 size={18} />
                  <span className="text-sm">Share</span>
                </button>
              </div>
              {/* Comments Modal */}
              {openCommentsPostId && modalPost && (
                <PostCommentsModal
                  post={modalPost}
                  onClose={() => setOpenCommentsPostId(null)}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Feed;
