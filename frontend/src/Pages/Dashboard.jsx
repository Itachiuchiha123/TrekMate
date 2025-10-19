"use client";
import { useState } from "react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../libs/utils.ts";
import logo from "../assets/logo.svg";
import { BellIcon, MessageCircle, User } from "lucide-react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "../components/ui/SideBar.jsx";

import { useSelector, useDispatch } from "react-redux";
import {
  setActivePage,
  setAnimate,
} from "../features/dashboard/dashboardSlice";
import { Outlet } from "react-router-dom"; // ✅ add this

export default function DashBoard() {
  const { user } = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.notifications.list);
  const unreadCount = notifications?.filter((n) => !n.read).length || 0;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const animate = useSelector((state) => state.dashboard.animate);

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => dispatch(setActivePage("dashboard")),
    },
    {
      label: "Messages",
      href: "/messages",
      icon: (
        <MessageCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => (
        dispatch(setActivePage("messages")), dispatch(setAnimate(true))
      ),
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: (
        <span className="relative flex items-center gap-1">
          <BellIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white min-w-[8px] h-[18px]">
              {unreadCount > 0 ? unreadCount : ""}
            </span>
          )}
        </span>
      ),
      onClick: () => dispatch(setActivePage("notifications")),
    },
    {
      label: "Profile",
      href: `/profile/${user?.username}`,
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => dispatch(setActivePage("profile")),
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => dispatch(setActivePage("settings")),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => {
        // handle logout
      },
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-[100vw] border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
      style={{
        fontFamily: "'Montserrat', 'Inter', 'Segoe UI', Arial, sans-serif",
      }}
    >
      {/* Left Sidebar */}
      <Sidebar open={open} setOpen={setOpen} animate={animate}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} onClick={link.onClick} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: `${user?.name}`,
                href: `/profile/${user?.username}`,
                icon: <User className="text-white" />,
                onClick: () => dispatch(setActivePage("profile")),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content - use Outlet here */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <Outlet /> {/* ✅ This renders child route components */}
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div
        className="h-5 w-9 flex-shrink-0"
        style={{ backgroundImage: `url(${logo})`, backgroundSize: "cover" }}
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        TrekMate
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
