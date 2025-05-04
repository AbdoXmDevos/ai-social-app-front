"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Home, User, LogOut, Globe, UserCircle } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Hide navbar on login and register pages
  if (pathname === "/auth/login" || pathname === "/auth/register") {
    return null;
  }

  return (
    <nav className="w-full flex justify-between items-center bg-[var(--card)] border-b border-[var(--border)] py-2 sticky top-0 z-30">
      <div className="flex items-center gap-2 ml-4">
        <span className="text-xl font-bold ml-4 text-[var(--primary)]">LOGO HERE</span>
      </div>
      <div className="flex gap-4 items-center text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">
        <Link href="/posts" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--primary)]">
          <div className="material-icons text-2xl">
            <Home />
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2 mr-4">
        <div className="h-6 w-px bg-[var(--border)]" /> {/* Vertical separator */}
        <div className="relative">
          <button
            className="ml-4 text-xl bg-[var(--card)] text-[var(--primary)] rounded-full p-2 hover:bg-[var(--secondary)] transition-all flex items-center gap-2 border border-[var(--border)]"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Profile menu"
          >
            <span className="material-icons">
              <User />
            </span>
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg z-50">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--secondary)] transition-colors text-[var(--primary)]"
                onClick={() => setIsProfileOpen(false)}
              >
                <UserCircle className="w-4 h-4" />
                My Profile
              </Link>
              <button
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[var(--secondary)] transition-colors text-[var(--primary)]"
                onClick={() => setIsProfileOpen(false)}
              >
                <Globe className="w-4 h-4" />
                Language
              </button>
              <button
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-500 hover:text-white transition-colors text-red-500"
                onClick={() => setIsProfileOpen(false)}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
} 