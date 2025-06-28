import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFollowUser } from "../features/follow/followSlice";

const FollowButton = ({ targetUserId, onFollowChange }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ Sync isFollowing when data updates
  useEffect(() => {
    if (currentUser && targetUserId) {
      const following = currentUser.following || [];
      setIsFollowing(following.includes(targetUserId));
    }
  }, [currentUser, targetUserId]);

  const handleClick = async () => {
    if (isProcessing || !targetUserId) return;

    setIsProcessing(true);
    setIsFollowing((prev) => !prev); // Optimistic

    try {
      await dispatch(toggleFollowUser(targetUserId)).unwrap();
      onFollowChange();
    } catch (error) {
      console.error("Follow/Unfollow failed:", error);
      setIsFollowing((prev) => !prev); // Revert on error
    } finally {
      setTimeout(() => setIsProcessing(false), 1000); // Prevent spam
    }
  };

  if (!currentUser || currentUser._id === targetUserId) return null; // Hide button if self

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className={`px-4 py-2 rounded font-semibold shadow transition duration-200 ${
        isFollowing
          ? "bg-white border border-gray-400 text-gray-800 hover:bg-gray-100"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
