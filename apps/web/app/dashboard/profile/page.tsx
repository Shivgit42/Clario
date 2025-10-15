"use client";
import { useUserStore, useUiStore } from "@repo/store";
import { signOut } from "../../../lib/auth-client";
import { useRouter } from "next/navigation";
import { Bookmark, Folder, LogOut } from "lucide-react";
import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, logout, getProfileStats, stats } = useUserStore();
  const { setError } = useUiStore();
  const router = useRouter();

  useEffect(() => {
    getProfileStats();
  }, [getProfileStats]);

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          logout();
          router.push("/");
        },
        onError: () => {
          setError("Logout failed. Please try again.");
        },
      },
    });
  };

  return (
    <div className="flex justify-center mt-8 sm:mt-16 px-4 pb-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-[#1F1F1F] border border-gray-200 dark:border-[#333333] shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md flex flex-col items-center relative overflow-hidden"
      >
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <Image
            src={user?.image || "/default-avatar.png"}
            alt="User Avatar"
            className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 shadow-md"
            width={120}
            height={120}
          />
        </motion.div>

        {/* Name + Email */}
        <h1 className="mt-4 text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
          {user?.name || "Anonymous"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center break-all px-2">
          {user?.email}
        </p>

        {/* Stats */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4 w-full">
          <motion.div className="flex flex-col items-center bg-gray-50 dark:bg-[#2A2A2A] rounded-xl p-4 sm:p-5 shadow-sm transition-all duration-200">
            <Folder className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500 dark:text-indigo-400" />
            <h2 className="mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center leading-tight">
              Total Folders
            </h2>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              {stats?.totalFolders ?? 0}
            </span>
          </motion.div>

          <motion.div className="flex flex-col items-center bg-gray-50 dark:bg-[#2A2A2A] rounded-xl p-4 sm:p-5 shadow-sm transition-all duration-200">
            <Bookmark className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500 dark:text-pink-400" />
            <h2 className="mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center leading-tight">
              Total Bookmarks
            </h2>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              {stats?.totalBookmarks ?? 0}
            </span>
          </motion.div>
        </div>

        {/* Joined Date */}
        <p className="mt-4 sm:mt-6 text-gray-600 dark:text-gray-400 text-xs sm:text-sm text-center">
          Joined on{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "Unknown"}
          </span>
        </p>

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="mt-6 sm:mt-8 px-6 py-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium shadow-md transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </motion.button>
      </motion.div>
    </div>
  );
}
