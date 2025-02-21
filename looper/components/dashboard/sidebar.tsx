"use client";
import { Home } from "lucide-react";
import Navlink from "./sidebar/navlink";
import Image from "next/image";
import LooperLogo from "@/public/logos/looper.png";
import SidebarFooter from "./sidebar/footer";

interface SidebarProps {
  username?: string;
}

const Sidebar = ({ username }: SidebarProps) => {
  return (
    <div className="flex w-full h-full flex-col justify-between pl-4 py-4">
      <div>
        <Image src={LooperLogo} alt="looper logo" className="w-[100px]" />
      </div>
      <div>
        <Navlink to="/protected" icon={Home} label="Home" />
      </div>
      <div>
        <SidebarFooter username={username} />{" "}
      </div>
    </div>
  );
};

export default Sidebar;
