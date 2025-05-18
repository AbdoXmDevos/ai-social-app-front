"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogOut, Globe, UserCircle, Mail, Bell, Settings, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NextImage from "next/image";

interface UserData {
  id: string;
  username: string;
  email: string;
  profile_picture_url?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClientComponentClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);

      if (session?.user?.id) {
        // Fetch user data from the users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setCurrentUser(userData);

        if (pathname === "/" && session?.user) {
          router.replace("/posts");
        }
      }
    };
    checkAuth();
  }, [pathname, router]);

  // Hide navbar on login and register pages
  if (pathname === "/auth/login" || pathname === "/auth/register") {
    return null;
  }

  // Show nothing until auth status is known
  if (isAuthenticated === null) {
    return null;
  }

  return (
    <nav className="w-full flex items-center justify-between bg-[#05141C]  py-2 px-4 sticky top-0 z-30">
      {/* Left Side - Brand */}
      <div className="flex items-center">
        <div className="ml-12">
          <NextImage
            src="/icon.png"
            alt="Logo"
            width={32}
            height={32}
            className="brightness-0 invert" // This makes the image white
          />
        </div>
      </div>

      {/* Center - Home */}
      <div className="flex items-center">
        <Link href="/posts" className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#1B2730] border border-gray-700 hover:bg-gray-700 transition-colors text-white">
          <Home className="w-5 h-5" />
          <span className="font-medium">Home</span>
        </Link>
      </div>

      {/* Right Side - Icons and Profile */}
      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <Link href="/auth/login" className="px-4 py-2 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">
              Login
            </Link>
            <Link href="/auth/register" className="px-4 py-2 rounded-full bg-[#1d9bf0] text-white font-bold hover:bg-[#1a8cd8] transition-colors">
              Register
            </Link>
          </>
        ) : (
          <>
            <button className="text-white rounded-full p-2 hover:bg-gray-800 transition-colors" aria-label="Settings">
              <Settings className="w-5 h-5" />
            </button>
            <button className="text-white rounded-full p-2 hover:bg-gray-800 transition-colors" aria-label="Messages">
              <Mail className="w-5 h-5" />
            </button>
            <button className="text-white rounded-full p-2 hover:bg-gray-800 transition-colors relative" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 bg-[#1d9bf0] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-full hover:bg-gray-800 p-1 px-3 transition-all duration-200 border border-gray-700 bg-[#1B2730] hover:border-gray-500"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="Profile menu"
              >
                <Avatar className="w-8 h-8 border border-gray-700">
                  {currentUser?.profile_picture_url ? (
                    <AvatarImage
                      src={currentUser.profile_picture_url}
                      alt={currentUser.username}
                    />
                  ) : (
                    <AvatarFallback className="bg-gray-700 text-white">
                      {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-white font-medium">
                  {currentUser?.username || 'User'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0f1419] border border-gray-800 rounded-lg shadow-lg z-50">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 transition-colors text-white"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <UserCircle className="w-4 h-4" />
                    My Profile
                  </Link>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-800 transition-colors text-white"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Globe className="w-4 h-4" />
                    Language
                  </button>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-500 hover:text-white transition-colors text-red-500"
                    onClick={async () => {
                      setIsProfileOpen(false);
                      try {
                        const supabase = createClientComponentClient();
                        await supabase.auth.signOut();
                        router.push('/auth/login');
                      } catch (error) {
                        console.error('Error signing out:', error);
                      }
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}