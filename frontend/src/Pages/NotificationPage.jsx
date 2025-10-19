import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../features/notification/notificationSlice";
import { useState } from "react";

const tabs = ["All", "Verified", "Mentions"];

const NotificationPage = () => {
  const dispatch = useDispatch();
  const { list: notifications, error } = useSelector(
    (state) => state.notifications
  );
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    console.log("Marking notification as read:", id);
    console.log("Current notifications:", notifications);
    dispatch(markNotificationAsRead(id));
  };

  return (
    <div className="w-full h-screen min-h-0 bg-black text-white flex flex-col p-0 m-0">
      <div className="text-2xl font-bold mb-4 px-6 pt-6">Notifications</div>
      <div className="flex gap-8 border-b border-neutral-700 mb-2 px-6">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            className={`pb-2 text-lg font-semibold ${
              activeTab === idx
                ? "border-b-2 border-blue-500 text-white"
                : "text-neutral-400"
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </button>
        ))}
        <div className="ml-auto flex items-center">
          <button className="text-neutral-400 hover:text-white text-xl">
            <span className="material-icons">settings</span>
          </button>
        </div>
      </div>
      <div className="flex-1 mt-2 px-6 overflow-y-auto min-h-0">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {notifications.length === 0 ? (
          <div className="text-neutral-400 text-center mt-12">
            No notifications yet.
          </div>
        ) : (
          notifications.map((n) => {
            const avatarUrl = n.sender?.avatar?.url || "/trekker-avatar.png";
            const postMedia =
              Array.isArray(n.post?.media_urls) && n.post.media_urls.length > 0
                ? n.post.media_urls[0]
                : null;
            const isVideo = postMedia && /\.(mp4|webm|ogg)$/i.test(postMedia);
            const postThumbnail =
              isVideo && n.post?.poster ? n.post.poster : postMedia;
            return (
              <div
                key={n._id}
                className={`flex items-center gap-4 p-4 border-b border-neutral-800 hover:bg-neutral-900 transition cursor-pointer ${
                  n.read ? "opacity-60" : ""
                }`}
                onClick={() => !n.read && handleMarkAsRead(n._id)}
              >
                <img
                  src={avatarUrl}
                  alt={n.sender?.username || "avatar"}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-700"
                />
                <div className="flex-1">
                  <span className="font-semibold text-white mr-2 cursor-pointer hover:underline">
                    {n.sender?.username || "User"}
                  </span>
                  <span className="text-neutral-300">{n.message}</span>
                  {n.post?.caption && (
                    <span className="text-neutral-400 ml-2">
                      "{n.post.caption}"
                    </span>
                  )}
                  <div className="text-xs text-neutral-500 mt-1">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </div>
                </div>
                {postThumbnail &&
                  (isVideo ? (
                    <video
                      src={postMedia}
                      poster={n.post?.poster || postMedia}
                      className="w-14 h-14 rounded-lg object-cover border border-neutral-700"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={postThumbnail}
                      alt="post thumbnail"
                      className="w-14 h-14 rounded-lg object-cover border border-neutral-700"
                    />
                  ))}
                <div className="ml-2">
                  <button className="text-neutral-400 hover:text-white">
                    <span className="material-icons">more_horiz</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
