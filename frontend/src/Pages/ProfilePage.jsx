import { useState } from "react";
import EditProfileModal from "../components/EditProfileModal";

const ProfilePage = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(user);

  const handleSave = (updatedData) => {
    // Here you can send updatedData to your backend API
    console.log(updatedData);
    setProfileData({ ...profileData, ...updatedData });
  };

  return (
    <div className="flex w-full bg-neutral-100 dark:bg-neutral-900 font-[Montserrat,sans-serif] pl-6 ">
      <div className="flex flex-col w-full">
        {/* Cover */}
        <div className="relative w-full">
          <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400" />
          <button className="absolute top-4 right-8 px-3 py-1 bg-white/80 dark:bg-neutral-800/80 rounded-lg shadow text-sm font-semibold hover:bg-white dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition">
            ✏️ Edit Cover
          </button>

          {/* Avatar */}
          <div className="absolute -bottom-16 left-8 flex items-center">
            <img
              src={user?.avatar.url || "/trekker-avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 shadow-lg object-cover bg-green-200"
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="mt-20 px-8 pb-12">
          {/* Name & Username */}
          <div className="flex items-center justify-between flex-wrap mb-6">
            <div>
              <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                {user?.name || "Sarah Johnson"}
              </h2>
              <p className="text-md text-neutral-500 dark:text-neutral-400 font-mono">
                @{user?.username || "sarahjohnson"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
              >
                Edit Profile
              </button>
              {/* Modal */}

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

          {/* Bio */}
          <p className="text-neutral-700 dark:text-neutral-300 mb-4 text-base">
            {user?.bio ||
              "Adventure seeker 🏔️ | Trekking enthusiast | Exploring the world one trail at a time ✨"}
          </p>

          {/* Details */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            <span>📍 {user?.location || "Unknown Location"}</span>
            <span>•</span>
            <span>
              Joined{" "}
              {new Date(user?.createdAt).toLocaleDateString() || "Unknown Date"}
            </span>
            <span>•</span>
            <a
              href={user?.website || "https://trekkingadventures.com"}
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {user?.website || "trekkingadventures.com"}
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center mb-8">
            <div>
              <p className="font-bold text-xl text-neutral-800 dark:text-neutral-100">
                {user?.events || 127}
              </p>
              <p className="text-sm text-neutral-500">Events</p>
            </div>
            <div>
              <p className="font-bold text-xl text-neutral-800 dark:text-neutral-100">
                {user?.followers || "2.4K"}
              </p>
              <p className="text-sm text-neutral-500">Followers</p>
            </div>
            <div>
              <p className="font-bold text-xl text-neutral-800 dark:text-neutral-100">
                {user?.following || 892}
              </p>
              <p className="text-sm text-neutral-500">Following</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-neutral-200 dark:border-neutral-700 mb-6">
            <button className="pb-2 border-b-2 border-blue-600 text-blue-600 font-semibold whitespace-nowrap">
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
            </button>
          </div>

          {/* Events List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={user?.avatar || "/trekker-avatar.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                  {user?.name || "Sarah Johnson"}
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
