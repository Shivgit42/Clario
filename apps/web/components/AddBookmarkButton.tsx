"use client";

import { useUiStore } from "@repo/store";
import { Plus } from "lucide-react";

export function AddBookmarkButton() {
  const { setShowBookmarkModal } = useUiStore();

  return (
    <div className="fixed bottom-6 right-6 z-[999] group">
      <button
        onClick={() => setShowBookmarkModal(true)}
        title="Add Bookmark"
        className="w-14 h-14 flex items-center justify-center rounded-full 
          bg-gradient-to-r from-[#ddba0e] via-[#f59e0b] to-[#d97706]
          text-white shadow-lg shadow-[#ddba0e]/40
          transition-all duration-300 ease-out
          hover:shadow-xl hover:shadow-[#ddba0e]/60
          active:scale-95 cursor-pointer"
      >
        <Plus size={26} />
      </button>

      {/* Tooltip */}
      <div
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 
        px-3 py-1.5 rounded-md text-xs font-medium
        bg-black text-white opacity-0 pointer-events-none
        group-hover:opacity-100 group-hover:translate-x-0
        transition-all duration-300"
      >
        Add Bookmark
      </div>
    </div>
  );
}
