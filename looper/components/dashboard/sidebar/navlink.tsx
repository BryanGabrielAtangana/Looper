"use client";
import React from "react";
import Link from "next/link";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

interface NavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  icon: Icon,
  label,
  className,
}) => {
  return (
    <Link
      href={to}
      className={clsx(
        "flex w-fit items-center bg-looperBlack space-x-2 p-2 px-4 rounded-full",
        className
      )}
    >
      <Icon
        className="w-5 h-5 text-gray-50 dark:text-gray-300"
        strokeWidth={1}
      />
      <span className="text-gray-50 font-normal">{label}</span>
    </Link>
  );
};

export default NavLink;
