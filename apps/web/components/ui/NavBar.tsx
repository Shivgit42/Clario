"use client";
import { useUiStore, useUserStore } from "@repo/store";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import ThemeToggle from "../Theme-toggle";
import { Menu } from "@headlessui/react";
import { signOut } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import { Logo } from "../logo";
import Link from "next/link";

export function NavBar() {
  const { user, logout } = useUserStore();
  const { setError } = useUiStore();
  const router = useRouter();

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
    <header className="h-16 flex justify-between items-center px-6 sm:px-10 border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-black/40 backdrop-blur-md relative z-50">
      {/* Left: Logo + Brand */}
      <Link href="/dashboard" className="flex items-center gap-2 group">
        <Logo width={32} height={32} />
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ddba0e] via-[#f59e0b] to-[#d97706] group-hover:opacity-90 transition">
          Clario
        </span>
      </Link>

      {/* Right: Controls */}
      <div className="flex items-center gap-5">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* User dropdown */}
        <Menu as="div" className="relative z-50">
          <Menu.Button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-[#2F2F2F] transition cursor-pointer">
            <Image
              src={user?.image || "/default-avatar.png"}
              alt="User Avatar"
              width={36}
              height={36}
              className="rounded-full border border-gray-300 dark:border-gray-600"
            />
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 shadow-xl focus:outline-none z-[100]">
            <div className="py-2">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => router.push("/dashboard/profile")}
                    className={`w-full text-left px-4 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                      active
                        ? "bg-gray-100 dark:bg-[#2A2A2A] text-gray-900 dark:text-gray-100"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    My Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                      active
                        ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    Log Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </header>
  );
}
