import Link from "next/link";
import { ArrowRight, NotebookPen, BookmarkPlus } from "lucide-react";
import { useBookmarkStore, useUiStore } from "@repo/store";
import Image from "next/image";
import { RecentBookmarkSkeleton } from "./RecentBookmarkSkeleton";

export function RecentBookmarks() {
  const { recentBookmarks } = useBookmarkStore();
  const { setShowBookmarkModal, loadingBookmarkSkeleton } = useUiStore();

  const hasBookmarks = recentBookmarks.length > 0;

  return (
    <div className="mt-8 max-w-xl mx-auto px-4">
      <h2 className="text-lg font-semibold mb-4">Recent Bookmarks</h2>

      {loadingBookmarkSkeleton ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, idx) => (
            <RecentBookmarkSkeleton key={idx} />
          ))}
        </div>
      ) : hasBookmarks ? (
        <ul className="space-y-3">
          {recentBookmarks.map((bookmark) => {
            const isNote = bookmark.type === "notes";

            const content = (
              <div className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-[#333333] bg-white dark:bg-[#2A2A2A] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
                {/* Left side */}
                <div className="flex items-center space-x-2 overflow-hidden">
                  {isNote ? (
                    <NotebookPen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <Image
                      src={
                        bookmark?.favicon
                          ? bookmark.favicon
                          : "/default-favicon.png"
                      }
                      width={16}
                      height={16}
                      alt="Bookmark favicon"
                      className="w-4 h-4"
                    />
                  )}
                  <span
                    className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[200px]"
                    title={bookmark.title}
                  >
                    {bookmark.title}
                  </span>
                </div>

                {/* Right side */}
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  {isNote ? (
                    <ArrowRight className="w-4 h-4 group-hover:text-blue-500 transition-colors" />
                  ) : (
                    <span
                      className="truncate max-w-[150px]"
                      title={bookmark.url ?? undefined}
                    >
                      {bookmark.url}
                    </span>
                  )}
                </div>
              </div>
            );

            return isNote ? (
              <li key={bookmark.id}>
                <Link href={`/dashboard/note/${bookmark.id}`}>{content}</Link>
              </li>
            ) : (
              <li key={bookmark.id}>
                <a
                  href={bookmark?.url ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-10 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#1E1E1E]">
          <div className="flex justify-center mb-4">
            <BookmarkPlus className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            No recent bookmarks yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-sm mx-auto">
            Save links or write notes to keep everything in one place.
          </p>
          <button
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            onClick={() => setShowBookmarkModal(true)}
          >
            <BookmarkPlus className="w-4 h-4 mr-2" />
            Add Bookmark
          </button>
        </div>
      )}
    </div>
  );
}
