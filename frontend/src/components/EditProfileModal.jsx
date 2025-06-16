import React, { useState } from "react";

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [preview, setPreview] = useState(user?.avatar || "");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      bio,
      website,
      avatar,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-black rounded-2xl shadow-2xl p-0 relative mx-2 sm:mx-4 md:mx-8"
        style={{ border: "1px solid #262626" }}
      >
        {/* Header */}
        <div className="px-4 pt-6 pb-2 sm:px-6 md:px-10 md:pt-10">
          <span className="text-xl sm:text-2xl font-bold text-white">
            Edit Profile
          </span>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col sm:flex-row items-center bg-neutral-900 rounded-2xl px-4 py-4 sm:px-8 sm:py-6 mb-6 sm:mb-8 mx-2 sm:mx-8">
          <img
            src={preview || "/trekker-avatar.png"}
            alt="Profile Preview"
            className="w-16 h-16 rounded-full object-cover border-2 border-neutral-700"
          />
          <div className="sm:ml-6 mt-4 sm:mt-0 flex-1 text-center sm:text-left">
            <div className="text-white font-bold text-base sm:text-lg">
              {user?.username}
            </div>
            <div className="text-neutral-400 text-xs sm:text-sm">
              {user?.name}
            </div>
          </div>
          <label
            htmlFor="avatar-upload"
            className="mt-4 sm:mt-0 sm:ml-auto px-4 py-2 bg-blue-600 text-white rounded font-semibold text-sm cursor-pointer hover:bg-blue-700 transition"
          >
            Change photo
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Form */}
        <form className="px-2 sm:px-8 pb-6 sm:pb-10" onSubmit={handleSubmit}>
          {/* Website */}
          <div className="mb-6 sm:mb-8">
            <label
              className="block text-white font-bold mb-2"
              htmlFor="website"
            >
              Website
            </label>
            <input
              id="website"
              className="w-full p-3 rounded bg-neutral-800 text-white border-none focus:outline-none text-base"
              placeholder="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            <p className="text-xs text-neutral-400 mt-2">
              Editing your links is only available on mobile. Visit the
              Instagram app and edit your profile to change the websites in your
              bio.
            </p>
          </div>

          {/* Bio */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-white font-bold mb-2" htmlFor="bio">
              Bio
            </label>
            <div className="relative">
              <textarea
                id="bio"
                className="w-full p-3 rounded bg-neutral-800 text-white border-none focus:outline-none resize-none text-base"
                placeholder="Bio"
                value={bio}
                rows={3}
                maxLength={150}
                onChange={(e) => setBio(e.target.value)}
              />
              <div className="absolute bottom-2 right-4 text-xs text-neutral-400">
                {bio.length} / 150
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-white font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="w-full p-3 rounded bg-neutral-800 text-white border-none focus:outline-none text-base"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8">
            <button
              type="button"
              className="px-5 py-2 rounded font-semibold bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition text-base"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded font-semibold bg-blue-600 text-white hover:bg-blue-700 transition text-base"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
