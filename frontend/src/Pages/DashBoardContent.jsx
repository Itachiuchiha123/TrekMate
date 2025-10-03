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

const DashboardContent = () => {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fileInputRef = useRef(null); // ✅ Ref for file input

  const handlePost = (e) => {
    e.preventDefault();
    if (post.trim() === "") return;
    setLoading(true);
    setTimeout(() => {
      setPosts([
        {
          content: post,
          image: selectedImage,
          date: new Date(),
        },
        ...posts,
      ]);
      setPost("");
      setSelectedImage(null);
      setLoading(false);
    }, 500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-1 h-full" style={{ fontFamily: "'Inter'" }}>
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 flex-1 w-full h-full overflow-y-auto scroll-hide transition-all duration-300">
        {showInput && (
          <form
            onSubmit={handlePost}
            className="flex flex-col gap-2 border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-4 bg-inherit relative"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
                <Smile className="text-neutral-500" size={28} />
              </div>
              <textarea
                className="flex-1 rounded-lg bg-transparent p-2 text-black dark:text-white resize-none outline-none text-lg placeholder:text-neutral-500 min-h-[48px]"
                rows={2}
                placeholder="What's happening?"
                value={post}
                onChange={(e) => setPost(e.target.value)}
              />
            </div>

            {selectedImage && (
              <div className="mt-2">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="max-w-xs rounded-md"
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-2 px-2">
              <div className="flex gap-3 text-blue-500">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()} // ✅ trigger file input
                >
                  <ImageIcon size={22} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef} // ✅ connect the ref
                  className="hidden"
                />

                <button type="button" tabIndex={-1}>
                  <Calendar size={22} />
                </button>
                <button type="button" tabIndex={-1}>
                  <MapPin size={22} />
                </button>
              </div>
              <button
                type="submit"
                className="bg-neutral-400 dark:bg-neutral-700 text-white px-5 py-2 rounded-full font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={post.trim() === "" || loading}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-col gap-6">
          {loading || posts.length === 0 ? (
            <>
              <div className="h-24 w-full rounded-xl bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
              <div className="h-64 w-full rounded-xl bg-gray-100 dark:bg-neutral-800 animate-pulse"></div>
              {posts.length === 0 && !loading && (
                <div className="text-neutral-500 text-center">
                  No posts yet.
                </div>
              )}
            </>
          ) : (
            posts.map((p, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col gap-3 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
                    <Smile className="text-neutral-500" size={24} />
                  </div>
                  <span className="font-semibold text-black dark:text-white">
                    Anonymous User
                  </span>
                </div>

                {/* Post content */}
                <div className="text-base text-black dark:text-white whitespace-pre-wrap">
                  {p.content}
                </div>

                {/* Image if exists */}
                {p.image && (
                  <div className="mt-2 w-full">
                    <img
                      src={p.image}
                      alt="Post"
                      className="rounded-lg max-w-full h-auto object-cover"
                    />
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-xs text-neutral-500 mt-1">
                  {p.date.toLocaleString()}
                </div>

                {/* Action buttons */}
                <div className="flex items-center  text-neutral-600 dark:text-neutral-400 mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    type="button"
                    className="flex items-center mr-8 hover:text-red-500 transition"
                  >
                    <Heart size={18} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center mr-8 hover:text-blue-500 transition"
                  >
                    <MessageCircle size={18} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center mr-8 hover:text-green-500 transition"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="hidden md:block">
        <RightSidebar />
      </div>
    </div>
  );
};

export default DashboardContent;
