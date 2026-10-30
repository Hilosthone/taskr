"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Layers,
  LayoutDashboard,
  FolderKanban,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Loader2,
} from "lucide-react";
import { userApi, removeAuthToken, UserProfile } from "@/lib/api";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await userApi.getProfile();
        if (response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  const handleSignOut = () => {
    removeAuthToken();
    router.push("/login");
  };

  const getInitials = () => {
    if (!profile) return "T";
    const first = profile.firstname?.[0] || "";
    const last = profile.lastname?.[0] || "";
    return `${first}${last}`.toUpperCase() || "U";
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-screen sticky top-0 bg-[var(--color-taskr-surface)]/80 backdrop-blur-xl border-r border-white/10 z-30 select-none shrink-0"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--color-taskr-blue)] to-[var(--color-taskr-purple)] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[var(--color-taskr-blue)]/20">
            <Layers className="w-5 h-5" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-lg text-white tracking-tight whitespace-nowrap"
            >
              Task<span className="text-[var(--color-taskr-blue)]">r</span>
            </motion.span>
          )}
        </Link>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                isActive
                  ? "bg-[var(--color-taskr-blue)] text-white shadow-lg shadow-[var(--color-taskr-blue)]/30"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <span className="whitespace-nowrap">{item.name}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Profile Badge & Logout */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-[var(--color-taskr-blue)] flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : profile?.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {profile ? `${profile.firstname} ${profile.lastname}` : "User"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {profile?.email_address || "Loading..."}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleSignOut}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer ${
            collapsed ? "px-0" : ""
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}