'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useUser } from "@/contexts/UserContext";
import UserProfile from "./UserProfile";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/players", label: "All Players List" },
    { href: "/auction", label: "Auction" },
    { href: "/rules", label: "Rules" },
    { href: "/myteam", label: "My Team" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-md z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Left side - Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300">
          Dream Team 7.0
        </Link>

        {/* Middle - Nav Links */}
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md font-semibold transition ${
                pathname === link.href
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side - User Info
        {user && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{user.name}</span>
          </div>
        )} */}

        <UserProfile/>
      </div>
    </nav>
  );
}
