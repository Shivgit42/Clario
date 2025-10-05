"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-10 lg:px-20 py-3">
        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="relative size-8">
            <Image src="/logo.svg" alt="Clario Logo" fill />
          </div>
          <span className="font-bold text-xl dark:text-white">Clario</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#ddba0e]"
          >
            Login
          </Link>
          <a
            href="https://chromewebstore.google.com/detail/ponmpddnllnnbagafncnlofljhmnhdgd"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm px-4 py-2 rounded-xl bg-gradient-to-r from-[#ddba0e] via-[#facc15] to-white text-black font-medium shadow hover:opacity-90 transition"
          >
            Add to Chrome
          </a>
          <LogIn className="sm:hidden size-5 text-gray-600 dark:text-gray-300" />
        </div>
      </div>
    </nav>
  );
}
