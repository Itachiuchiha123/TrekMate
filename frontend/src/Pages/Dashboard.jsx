"use client";
import { useState } from "react";

import {
  IconArrowLeft,
  IconBrandTabler,
  IconNotification,
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

import DashboardContent from "./DashBoardContent.jsx";
import Profile from "./ProfilePage.jsx";
import { useSelector } from "react-redux";

// Profile component

// Right Sidebar Component

export default function DashBoard() {
  const { user } = useSelector((state) => state.auth);

  // Track which page is active
  const [activePage, setActivePage] = useState("dashboard");
  const [open, setOpen] = useState(false);

  // Sidebar links with onClick handlers
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => setActivePage("dashboard"),
    },
    {
      label: "Notifications",
      href: "#profile",
      icon: (
        <BellIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => setActivePage("profile"),
    },
    {
      label: "Messages",
      href: "#profile",
      icon: (
        <MessageCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => setActivePage("profile"),
    },
    {
      label: "Profile",
      href: "#profile",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => setActivePage("profile"),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => {}, // Add logic if needed
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => {}, // Add logic if needed
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-[100vw] border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      {/* Left Sidebar */}
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <>
              <Logo />
            </>
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
                href: "#",
                icon: <User className="text-white" />,
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {activePage === "dashboard" ? (
          <DashboardContent />
        ) : (
          <Profile user={user} />
        )}
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div
        className="h-5 w-9  flex-shrink-0"
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
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
