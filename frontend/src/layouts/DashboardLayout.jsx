// src/layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "../components/ui/SideBar.jsx";
import { useSelector } from "react-redux";
import { User } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.svg";

export default function DashboardLayout() {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: <User />,
    },
    {
      label: "Profile",
      href: `/profile/${user?.username}`,
      icon: <User />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <User />,
    },
  ];

  return (
    <div className="flex h-screen w-screen bg-neutral-800 text-white">
      <Sidebar open={open} setOpen={setOpen} animate={false}>
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
                href: "#",
                icon: <User className="text-white" />,
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 overflow-y-auto">
        <Outlet /> {/* Here the content will be rendered */}
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
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
