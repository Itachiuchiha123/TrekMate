import React from "react";
import { cn } from "../../libs/utils";
import { PlusCircle } from "lucide-react";

const RightSidebar = () => (
  <aside
    className={cn(
      "w-full md:w-[340px] flex-shrink-0 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-700",
      "flex flex-col h-full px-4 py-6 md:py-8 md:px-6 z-10",
      "font-sans"
    )}
    style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}
  >
    {/* Search and Host Trek */}
    <div className="mb-6">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-full bg-neutral-100 dark:bg-neutral-800 px-4 py-2 pl-10 text-sm text-black dark:text-white focus:outline-none"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <button
          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-2 rounded-full text-sm transition"
          title="Host Trek"
        >
          <PlusCircle size={18} />
          <span className="hidden md:inline">Host Trek</span>
        </button>
      </div>
    </div>
    {/* Subscribe to Premium */}
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 mb-6">
      <h3 className="font-bold text-lg text-black dark:text-white mb-1">
        Subscribe to Premium
      </h3>
      <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
        Subscribe to unlock new features and if eligible, receive a share of
        revenue.
      </p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full text-sm transition">
        Subscribe
      </button>
    </div>

    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 mb-6">
      <h3 className="font-bold text-lg text-black dark:text-white mb-3">
        What’s happening
      </h3>
      <div className="flex flex-col gap-3">
        <div>
          <div className="text-xs text-neutral-500">
            Everest Base Camp · Trending
          </div>
          <div className="font-semibold text-black dark:text-white">
            New Trekking Season Opens
          </div>
          <div className="text-xs text-neutral-500">2.1K trekkers joined</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500">
            Annapurna Circuit · Popular
          </div>
          <div className="font-semibold text-black dark:text-white">
            Trail Conditions Updated
          </div>
          <div className="text-xs text-neutral-500">Latest weather alerts</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500">Nepal · Trending</div>
          <div className="font-semibold text-black dark:text-white">
            #TrekTips
          </div>
          <div className="text-xs text-neutral-500">Share your best advice</div>
        </div>
        <div>
          <div className="text-xs text-neutral-500">Community · Trending</div>
          <div className="font-semibold text-black dark:text-white">
            #GearReview
          </div>
          <div className="text-xs text-neutral-500">
            Discuss your favorite gear
          </div>
        </div>
      </div>
      <button className="mt-3 text-blue-500 hover:underline text-sm">
        Show more
      </button>
    </div>
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4">
      <h3 className="font-bold text-lg text-black dark:text-white mb-3">
        Who to follow
      </h3>
      <div className="flex items-center gap-3 mb-3">
        <img
          src="https://pbs.twimg.com/profile_images/1649579639634384896/6w2vNhbb_400x400.jpg"
          alt="Don Bluth"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="font-semibold text-black dark:text-white flex items-center gap-1">
            Don Bluth
            <svg
              className="w-4 h-4 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-xs text-neutral-500">@DonBluth</div>
        </div>
        <button className="bg-black dark:bg-white dark:text-black text-white px-4 py-1 rounded-full text-sm font-semibold">
          Follow
        </button>
      </div>
      {/* Add more suggestions as needed */}
    </div>
  </aside>
);

export default RightSidebar;
