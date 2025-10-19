import { useEffect, useState } from "react";
import EditProfileModal from "../components/EditProfileModal";
import EditCoverModal from "../components/EditCoverModal";
import FollowButton from "../components/FollowButton";
import { checkAuth } from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchPublicProfile } from "../features/public/profileSlice";
import { fetchUserPosts, deletePost } from "../features/posts/postSlice";
import { useParams } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import UpdatePostModal from "../components/UpdatePostModal";
import PostCommentsModal from "../components/PostCommentsModal";

const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [profileData, setProfileData] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const { username } = useParams();
  const dispatch = useDispatch();

  const { user: currentuser } = useSelector((state) => state.auth);
  const { profile: fetchedProfile } = useSelector((state) => state.profile);
  const { userPosts, userPostsLoading, userPostsError } = useSelector(
    (state) => state.posts
  );

  const isOwner = currentuser?.username === username;

  // New: get posts/can_view_posts for public profile
  const publicProfile = fetchedProfile;
  const publicUser = publicProfile?.profile;
  const publicPosts = publicProfile?.posts;
  const canViewPublicPosts = publicProfile?.can_view_posts;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (!isOwner && username) {
        dispatch(fetchPublicProfile(username));
      }
      if (isOwner) {
        dispatch(fetchUserPosts({ page: 1 }));
      }
      setLoading(false);
    };

    loadData();
  }, [username, isOwner, dispatch]);

  useEffect(() => {
    if (isOwner) {
      setProfileData(currentuser);
      console.log("Current user profile data:", currentuser);
    } else {
      setProfileData(publicUser);
      console.log("Fetched profile data:", publicUser);
    }
  }, [isOwner, currentuser, publicUser]);

  const user = profileData;

  const handleSave = (updatedData) => {
    setProfileData({ ...profileData, ...updatedData });
  };

  const refetchProfile = async () => {
    if (!isOwner && username) {
      setLoading(true);
      dispatch(fetchPublicProfile(username));
      dispatch(checkAuth()); // Ensure auth state is updated
      setLoading(false);
    }
  };

  //menu button component
  const MenuButton = ({ post }) => {
    const [open, setOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = () => {
      setShowConfirm(true);
      setOpen(false);
    };

    const confirmDelete = async () => {
      try {
        await dispatch(deletePost(post._id)).unwrap();
        if (isOwner) {
          dispatch(fetchUserPosts({ page: 1 }));
        } else {
          await refetchProfile();
        }
        toast.success("Post deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete post");
      } finally {
        setShowConfirm(false);
      }
    };

    const handleUpdate = () => {
      setOpen(false);
      setEditPost(post);
    };

    return (
      <div
        className="relative inline-block text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="p-1 rounded-full bg-black/60 hover:bg-black/80 text-white"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
        >
          <MoreHorizontal size={20} />
        </button>
        {open && (
          <div
            className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 z-30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                Delete Post
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate();
                }}
              >
                Update Post
              </button>
            </div>
          </div>
        )}
        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 w-full max-w-xs">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
                Delete Post?
              </h3>
              <p className="mb-6 text-neutral-700 dark:text-neutral-300">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // unavailable message
  if (!loading && !user) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-black">
        <p className="text-lg text-neutral-600 dark:text-neutral-400 text-center">
          <span>Sorry, this page isn't available.</span>
          <br />
          The link you followed may be broken, or the page may have been
          removed. Go back to TrekMate.
        </p>
      </div>
    );
  }

  // Posts to show
  const postsToShow = isOwner ? userPosts : publicPosts;
  const showPosts = isOwner || canViewPublicPosts;
  const postsLoading = isOwner ? userPostsLoading : false;
  const postsError = isOwner ? userPostsError : null;

  return (
    <div className="flex w-full h-screen overflow-y-auto bg-neutral-100 dark:bg-neutral-900 font-[Montserrat,sans-serif] pl-6">
      <div className="flex flex-col w-full">
        {/* Cover */}
        <div className="relative w-full">
          {user?.coverPhoto?.url ? (
            <img
              src={user.coverPhoto.url}
              alt="Cover"
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400" />
          )}

          {isOwner && (
            <button
              onClick={() => setIsCoverModalOpen(true)}
              className="absolute top-4 right-8 px-3 py-1 bg-white/80 dark:bg-neutral-800/80 rounded-lg shadow text-sm font-semibold hover:bg-white dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition text-white"
            >
              ✏️ Edit Cover
            </button>
          )}

          {/* Avatar */}
          <div className="absolute -bottom-16 left-8 flex items-center">
            <img
              src={user?.avatar?.url || "/trekker-avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 shadow-lg object-cover bg-green-200"
            />
          </div>
        </div>

        <EditCoverModal
          isOpen={isCoverModalOpen}
          onClose={() => setIsCoverModalOpen(false)}
        />

        {/* Profile Content */}
        <div className="mt-20 px-8 pb-12">
          <div className="flex items-center justify-between flex-wrap mb-6">
            <div>
              <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                {user?.name}
              </h2>
              <p className="text-md text-neutral-500 dark:text-neutral-400 font-mono">
                @{user?.username}
              </p>
            </div>

            <div className="flex gap-2">
              {isOwner ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
                >
                  Edit Profile
                </button>
              ) : (
                <FollowButton
                  targetUserId={user?._id}
                  onFollowChange={refetchProfile}
                />
              )}
              <button className="bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 px-3 py-2 rounded-lg font-semibold text-neutral-700 dark:text-neutral-200">
                🔗
              </button>
            </div>
          </div>
          <EditProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            user={profileData}
            onSave={handleSave}
          />
          {/* Bio & Info */}
          <p className="text-neutral-700 dark:text-neutral-300 mb-4 text-base">
            {user?.bio}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            <span>📍 {user?.location}</span>
            <span>•</span>
            <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <a
              href={user?.website}
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {user?.website}
            </a>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center mb-8">
            <div>
              <p className="font-bold text-xl text-neutral-800 dark:text-neutral-100">
                {postsToShow?.length || 0}
              </p>
              <p className="text-sm text-neutral-500">Posts</p>
            </div>
            <div>
              <p className="font-bold text-xl text-neutral-800 dark:text-neutral-100">
                {user?.followers?.length || 0}
              </p>
              <p className="text-sm text-neutral-500">Followers</p>
            </div>
            <div>
              <p className="font-bold text-xl text-neutral-800 dark:text-neutral-100">
                {user?.following?.length || 0}
              </p>
              <p className="text-sm text-neutral-500">Following</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-6 border-b border-neutral-200 dark:border-neutral-700 mb-6">
            {/* <button className="pb-2 border-b-2 border-blue-600 text-blue-600 font-semibold whitespace-nowrap">
              Events
            </button>
            <button className="pb-2 text-neutral-500 hover:text-blue-600 whitespace-nowrap">
              Posts
            </button>
            <button className="pb-2 text-neutral-500 hover:text-blue-600 whitespace-nowrap">
              Liked
            </button>
            <button className="pb-2 text-neutral-500 hover:text-blue-600 whitespace-nowrap">
              Saved
            </button> */}
          </div>
          {/* Posts Section */}
          {showPosts && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
                {isOwner ? "Your Posts" : `${user?.name}'s Posts`}
              </h3>
              {postsLoading && <p>Loading posts...</p>}
              {postsError && <p className="text-red-500">{postsError}</p>}
              {postsToShow && postsToShow.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[2px] bg-neutral-900 dark:bg-black">
                  {postsToShow.map((post) => (
                    <div
                      key={post._id}
                      className="relative aspect-square bg-neutral-200 dark:bg-neutral-800 overflow-hidden group cursor-pointer"
                      onClick={() => {
                        console.log("Selected post:", post);
                        setSelectedPost(post);
                      }}
                    >
                      {/* Triple dot menu only for owner */}
                      {isOwner && (
                        <div className="absolute top-2 right-2 z-20">
                          <MenuButton post={post} />
                        </div>
                      )}
                      {post.media_urls && post.media_urls.length > 0 ? (
                        post.media_urls[0].match(/\.(mp4|webm|ogg)$/i) ? (
                          <video
                            src={post.media_urls[0]}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                            style={{ pointerEvents: "none" }}
                            poster={undefined} // poster will be the first frame by default
                          />
                        ) : (
                          <img
                            src={post.media_urls[0]}
                            alt="Post Media"
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-neutral-400 text-4xl bg-neutral-100 dark:bg-neutral-900">
                          <span>📷</span>
                        </div>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center text-white transition-opacity duration-200">
                        <div className="font-semibold text-xs px-2 text-center truncate w-full">
                          {post.caption}
                        </div>
                      </div>
                      {/* Media type icon */}
                      {post.media_urls &&
                        post.media_urls.length > 0 &&
                        post.media_urls[0].match(/\.(mp4|webm|ogg)$/i) && (
                          <span className="absolute top-2 right-8 text-white text-xl bg-black/60 rounded-full p-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5v-11z"
                              />
                            </svg>
                          </span>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                !postsLoading && (
                  <p className="text-neutral-500">No posts yet.</p>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <UpdatePostModal
        post={editPost}
        isOpen={!!editPost}
        onClose={() => {
          setEditPost(null);
          if (isOwner) {
            dispatch(fetchUserPosts({ page: 1 }));
            dispatch(checkAuth());
          } else {
            refetchProfile();
          }
        }}
        user={user}
      />
      {/* PostCommentsModal for selected post */}
      {selectedPost && (
        <PostCommentsModal
          post={{ ...selectedPost, user }}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
