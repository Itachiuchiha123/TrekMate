import {
  Image as ImageIcon,
  Smile,
  Calendar,
  MapPin,
  Slash,
  List,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import RightSidebar from "../components/ui/RightSidebar";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  createPost,
  fetchPosts,
  uploadPostMedia,
} from "../features/posts/postSlice";
import Feed from "../components/Feed";
import { checkAuth } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import axios from "axios";

const DashboardContent = () => {
  const [post, setPost] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [showInput, setShowInput] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const {
    posts,
    loading: postsLoading,
    mediaUploading,
    mediaUploadError,
  } = useSelector((state) => state.posts);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const [fakeProgress, setFakeProgress] = useState(0);
  const [posting, setPosting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Fetch posts on mount
  useEffect(() => {
    dispatch(fetchPosts({ page: 1 }));
  }, [dispatch]);

  // Progress bar for media upload and post creation
  useEffect(() => {
    let interval;
    if (mediaUploading || posting) {
      setFakeProgress(0);
      interval = setInterval(() => {
        setFakeProgress((prev) =>
          prev < 95 ? prev + Math.random() * 5 : prev
        );
      }, 200);
    } else if (!mediaUploading && !posting && fakeProgress !== 0) {
      setFakeProgress(100);
      setTimeout(() => setFakeProgress(0), 500);
    }
    return () => clearInterval(interval);
  }, [mediaUploading, posting]);

  // Helper to extract tags from caption
  function extractTags(text) {
    const matches = text.match(/#\w+/g);
    return matches ? matches.map((tag) => tag.replace("#", "")) : [];
  }

  const handlePost = async (e) => {
    e.preventDefault();
    if (post.trim() === "") return;
    setPosting(true);
    try {
      let mediaUrls = [];
      if (selectedImages.length > 0) {
        const formData = new FormData();
        selectedImages.forEach(({ file }) => formData.append("files", file));
        const uploadedMedia = await dispatch(
          uploadPostMedia(formData)
        ).unwrap();

        if (uploadedMedia && Array.isArray(uploadedMedia)) {
          mediaUrls = uploadedMedia.map((m) => m.url);
        } else {
          toast.error(
            mediaUploadError || "Failed to upload media. Please try again."
          );
        }
      }

      const autoTags = extractTags(post);
      const payload = {
        caption: post,
        media_urls: mediaUrls,
        location,
        is_public: true,
        tags: autoTags,
      };
      dispatch(createPost(payload)).unwrap();
      dispatch(checkAuth()); // Refresh user data
      setPost("");
      setSelectedImages([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setLocation("");
      setTags("");
    } catch (error) {
      console.error("Post submission error:", error);
    } finally {
      setPosting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const previews = files.map((file) => {
        return { file, url: URL.createObjectURL(file) };
      });
      setSelectedImages((prev) => [...prev, ...previews]);
    }
  };

  const handleRemoveImage = (idx) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-1 h-full" style={{ fontFamily: "'Inter'" }}>
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 flex-1 w-full h-full overflow-y-auto scroll-hide transition-all duration-300">
        {showInput && (
          <form
            onSubmit={handlePost}
            className="flex flex-col gap-0 border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-4 bg-inherit relative max-w-2xl mx-auto w-full"
            style={{ boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)" }}
          >
            <div className="flex items-start gap-3 px-4 pt-4">
              <div className="h-11 w-11 rounded-full bg-gray-300 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
                <img
                  src={user?.avatar?.url || "/trekker-avatar.png"}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <textarea
                className="flex-1 bg-transparent p-2 text-black dark:text-white resize-none outline-none text-lg placeholder:text-neutral-500 min-h-[48px] border-none shadow-none"
                rows={2}
                placeholder="What's happening?"
                value={post}
                onChange={(e) => setPost(e.target.value)}
                style={{ fontFamily: "inherit", background: "none" }}
              />
            </div>
            {selectedImages.length > 0 && (
              <div className="flex gap-2 mt-2 px-4 flex-wrap">
                {selectedImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img.url}
                      alt="Preview"
                      className="max-w-xs rounded-md object-cover h-32 w-32"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-80 group-hover:opacity-100 transition"
                      title="Remove"
                    >
                      <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                        ×
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between px-4 pt-2">
              <div className="flex gap-3 text-blue-500">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full p-2"
                  title="Add image or video"
                >
                  <ImageIcon size={22} />
                </button>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full p-2"
                  title="Add emoji"
                >
                  <Smile size={22} />
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full p-2"
                  title="Add event"
                >
                  <Calendar size={22} />
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full p-2"
                  title="Add location"
                >
                  <MapPin size={22} />
                </button>
              </div>
              <button
                type="submit"
                className="bg-neutral-400 dark:bg-neutral-700 text-white px-5 py-2 rounded-full font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={post.trim() === "" || posting}
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
            {(mediaUploading || posting) && (
              <div className="px-6 pb-4">
                <div className="w-full bg-neutral-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2.5 transition-all duration-300"
                    style={{ width: `${fakeProgress.toFixed(1)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-white mt-2 text-center">
                  {mediaUploading ? "Uploading media..." : "Posting..."}{" "}
                  {Math.round(fakeProgress)}%
                </p>
              </div>
            )}
          </form>
        )}

        <Feed posts={posts} postsLoading={postsLoading} />
      </div>

      <div className="hidden md:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default DashboardContent;
