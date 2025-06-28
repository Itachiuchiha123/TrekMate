import { useEffect, useState } from "react";
import EditProfileModal from "../components/EditProfileModal";
import EditCoverModal from "../components/EditCoverModal";
import FollowButton from "../components/FollowButton";
import { checkAuth } from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchPublicProfile } from "../features/public/profileSlice";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [profileData, setProfileData] = useState(null);

  const { username } = useParams();
  const dispatch = useDispatch();

  const { user: currentuser } = useSelector((state) => state.auth);
  const { profile: fetchedProfile } = useSelector((state) => state.profile);

  const isOwner = currentuser?.username === username;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (!isOwner && username) {
        await dispatch(fetchPublicProfile(username));
      }
      setLoading(false);
    };

    loadData();
  }, [username, isOwner, dispatch]);

  useEffect(() => {
    if (isOwner) {
      setProfileData(currentuser);
    } else {
      setProfileData(fetchedProfile?.profile);
    }
  }, [isOwner, currentuser, fetchedProfile]);

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

  // ✅ Properly show unavailable message
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

  return (
    <div className="flex w-full bg-neutral-100 dark:bg-neutral-900 font-[Montserrat,sans-serif] pl-6">
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
                {user?.posts?.length || 0}
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

          {/* Example Event */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={user?.avatar?.url || "/trekker-avatar.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                  {user?.name}
                </span>
                <span className="text-xs text-neutral-400 ml-2">
                  2 days ago
                </span>
              </div>
              <div className="font-bold text-lg text-neutral-800 dark:text-neutral-100 mb-2">
                Himalayan Base Camp Trek
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 mb-3 text-sm">
                Join us for an incredible 14-day journey to Everest Base Camp.
                Experience breathtaking views, challenging trails, and
                unforgettable memories.
              </p>
              <img
                src="/trek1.jpg"
                alt="Himalayan Trek"
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                <span>📅 Oct 15-29, 2024</span>
                <span>•</span>
                <span>12 participants</span>
                <span>•</span>
                <span>$2,499</span>
              </div>
              <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400 text-sm">
                <span>24 👍</span>
                <span>8 💬</span>
                <button className="hover:underline">Share</button>
                <span className="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
