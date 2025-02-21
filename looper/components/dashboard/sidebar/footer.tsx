import { LogOut, User } from "lucide-react";
import React from "react";
import { signOutAction } from "@/app/actions";

interface SidebarFooterProps {
  username?: string;
}

const getRandomDarkColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 50) + 50;
  const lightness = Math.floor(Math.random() * 30) + 10;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const SidebarFooter = ({ username }: SidebarFooterProps) => {
  const firstLetter = username ? username.charAt(0).toUpperCase() : "?";
  const bgColor = getRandomDarkColor();

  return (
    <div className="flex flex-col gap-4">
      {/* Logout Button */}

      <div
        className="w-10 h-10 rounded-full bg-white flex items-center justify-center cursor-pointer"
        onClick={signOutAction}
      >
        <LogOut strokeWidth={2} size={16} />
      </div>

      {/* Profile Badge */}
      <div className="flex w-fit items-center space-x-2 p-2 rounded-full bg-white">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: bgColor }}
        >
          {firstLetter}
        </div>
        {/* <User strokeWidth={2} size={16} /> */}
      </div>
    </div>
  );
};

export default SidebarFooter;
