import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updatePost, uploadPostMedia } from "../features/posts/postSlice";
import toast from "react-hot-toast";

const UpdatePostModal = ({ post, isOpen, onClose, user }) => {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMediaIdx, setCurrentMediaIdx] = useState(0);
  const [fakeProgress, setFakeProgress] = useState(0);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // Ensure state updates when modal opens with a new post
  useEffect(() => {
    if (isOpen && post) {
      setCaption(post.caption || "");
      setLocation(post.location || "");
      setMedia(post.media_urls ? [...post.media_urls] : []);
      setCurrentMediaIdx(0);
    }
  }, [isOpen, post]);

  // Progress bar for media upload and post update
  useEffect(() => {
    let interval;
    if (loading) {
      setFakeProgress(0);
      interval = setInterval(() => {
        setFakeProgress((prev) =>
          prev < 95 ? prev + Math.random() * 5 : prev
        );
      }, 200);
    } else if (!loading && fakeProgress !== 0) {
      setFakeProgress(100);
      setTimeout(() => setFakeProgress(0), 500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (!isOpen) return null;

  const handleRemoveMedia = (idx) => {
    setMedia((prev) => {
      const newMedia = prev.filter((_, i) => i !== idx);
      // Adjust currentMediaIdx if needed
      if (newMedia.length === 0) return [];
      if (currentMediaIdx >= newMedia.length) {
        setCurrentMediaIdx(newMedia.length - 1);
      }
      return newMedia;
    });
  };

  const handleAddMedia = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const previews = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setMedia((prev) => [...prev, ...previews]);
    }
  };

  const handleAddMediaClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Separate existing URLs and new files
      const existingUrls = media
        .filter((m) => typeof m === "string")
        .map((m) => m);
      const newFiles = media.filter((m) => typeof m === "object" && m.file);
      let uploadedUrls = [];
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach(({ file }) => formData.append("files", file));
        const uploadedMedia = await dispatch(
          uploadPostMedia(formData)
        ).unwrap();
        if (uploadedMedia && Array.isArray(uploadedMedia)) {
          uploadedUrls = uploadedMedia.map((m) => m.url);
        } else {
          toast.error("Failed to upload media. Please try again.");
        }
      }
      const allMediaUrls = [...existingUrls, ...uploadedUrls];
      await dispatch(
        updatePost({
          postId: post._id,
          updatedData: {
            caption,
            location,
            media_urls: allMediaUrls,
          },
        })
      ).unwrap();
      toast.success("Post updated successfully!");
      onClose();
    } catch (err) {
      toast.error(err?.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-4xl min-h-[600px] flex flex-col md:flex-row overflow-hidden relative border border-neutral-800">
        {/* Media Section */}
        <div className="md:w-3/5 w-full flex flex-col items-center justify-center bg-black relative min-h-[600px]">
          {/* Slider Controls */}
          {media.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2 z-20 hover:bg-black"
                onClick={() =>
                  setCurrentMediaIdx((prev) =>
                    prev === 0 ? media.length - 1 : prev - 1
                  )
                }
                aria-label="Previous"
              >
                &#8592;
              </button>
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2 z-20 hover:bg-black"
                onClick={() =>
                  setCurrentMediaIdx((prev) =>
                    prev === media.length - 1 ? 0 : prev + 1
                  )
                }
                aria-label="Next"
              >
                &#8594;
              </button>
            </>
          )}
          {/* Carousel Dots */}
          {media.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {media.map((_, i) => (
                <span
                  key={i}
                  className={`inline-block w-2 h-2 rounded-full ${
                    i === currentMediaIdx ? "bg-blue-500" : "bg-gray-400"
                  } opacity-80`}
                  onClick={() => setCurrentMediaIdx(i)}
                  style={{ cursor: "pointer" }}
                ></span>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-4 w-full h-full justify-center items-center">
            {media && media.length > 0 ? (
              <div className="relative group w-full flex items-center justify-center h-[520px] md:h-[600px]">
                {(() => {
                  const current = media[currentMediaIdx];
                  const url =
                    typeof current === "string" ? current : current.url;
                  if (url && url.match(/\.(mp4|webm|ogg)$/i)) {
                    return (
                      <video
                        src={url}
                        controls
                        className="w-full h-full rounded-2xl object-contain bg-black"
                        style={{ display: "block" }}
                      />
                    );
                  } else {
                    return (
                      <img
                        src={url}
                        alt="Post Media"
                        className="w-full h-full rounded-2xl object-contain bg-black"
                        style={{ display: "block" }}
                      />
                    );
                  }
                })()}
                <button
                  type="button"
                  className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-1 opacity-80 hover:opacity-100 z-10"
                  onClick={() => handleRemoveMedia(currentMediaIdx)}
                  title="Remove"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-[520px] md:h-[600px] text-neutral-400 text-4xl bg-neutral-800 rounded-lg">
                <span>📷</span>
              </div>
            )}
          </div>
          {/* Add Media Button */}
          <button
            type="button"
            className="mt-4 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-2xl shadow-lg absolute bottom-8 right-8 z-20"
            onClick={handleAddMediaClick}
            title="Add Media"
          >
            +
          </button>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            ref={fileInputRef}
            onChange={handleAddMedia}
            className="hidden"
          />
        </div>
        {/* Edit Form Section */}
        <div className="md:w-2/5 w-full flex flex-col bg-neutral-900 p-8 relative min-h-[600px] border-l border-neutral-800">
          <button
            className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            onClick={onClose}
          >
            <X size={24} />
          </button>
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src={user?.avatar?.url || "/trekker-avatar.png"}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover bg-neutral-700 border border-neutral-800"
            />
            <span className="text-white font-semibold">
              {user?.name || "User"}
            </span>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
            <textarea
              className="w-full rounded-lg border border-neutral-800 p-3 text-lg bg-neutral-900 text-white min-h-[120px] resize-none"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              maxLength={2200}
            />
            <input
              className="w-full rounded-lg border border-neutral-800 p-3 text-lg bg-neutral-900 text-white"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location (optional)"
            />
            <div className="flex-1" />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold mt-2 disabled:opacity-60 text-lg w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Post"}
            </button>
          </form>
          {/* Progress Bar UI */}
          {loading && (
            <div className="absolute top-0 left-0 w-full px-8 pt-4 z-30 pb-4">
              <div className="w-full bg-neutral-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-2.5 transition-all duration-300"
                  style={{ width: `${fakeProgress.toFixed(1)}%` }}
                ></div>
              </div>
              <p className="text-sm text-white mt-2 text-center">
                Updating... {Math.round(fakeProgress)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatePostModal;
