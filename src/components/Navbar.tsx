"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Home, User, LogOut, Globe, UserCircle } from "lucide-react";
import { useState } from "react";
import { usePostsStore } from "@/store/usePostsStore";
import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { loadPosts } = usePostsStore();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClientComponentClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
      if (pathname === "/" && session?.user) {
        router.replace("/posts");
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
    <nav className="w-full flex items-center bg-[var(--card)] border-b border-[var(--border)] py-2 sticky top-0 z-30 relative">
      {/* Logo Left */}
      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
        <span className="text-xl font-bold ml-4 text-[var(--primary)]">LOGO HERE</span>
      </div>
      {/* Center Navigation */}
      {pathname === "/" && !isAuthenticated && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-6 items-center text-lg font-semibold">
          <Link href="/" className="px-3 py-2 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--primary)]">Home</Link>
          <Link href="#features" className="px-3 py-2 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--primary)]">Features</Link>
          <Link href="#pricing" className="px-3 py-2 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--primary)]">Pricing</Link>
          <Link href="#contact" className="px-3 py-2 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--primary)]">Contact</Link>
          <Link href="#about" className="px-3 py-2 rounded-lg hover:bg-[var(--secondary)] transition-colors text-[var(--primary)]">About</Link>
        </div>
      )}
      {/* Right Side: Auth Buttons or Profile */}
      <div className="flex items-center gap-2 ml-auto mr-4">
        {pathname === "/" && !isAuthenticated ? (
          <>
            <Link href="/auth/login" className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-[var(--primary)] shadow-md border border-[var(--border)]  dark:hover:bg-black/20 hover:bg-gray-100 px-7 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-semibold">Login</Link>
            <Link href="/auth/register" className="flex items-center gap-2 px-3 py-2 rounded-lg  dark:bg-white bg-black hover:bg-[var(--primary)] px-7 dark:hover:bg-white/80 transition-colors text-[var(--secondary)] font-semibold">Register</Link>
            <ThemeToggle />
          </>
        ) : (
          isAuthenticated && (
            <>
              <div className="h-6 w-px bg-[var(--border)]" />
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
            </>
          )
        )}
      </div>
    </nav>
  );
}