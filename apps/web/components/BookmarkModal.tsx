import { Loader2, X } from "lucide-react";
import { useUiStore, useBookmarkStore, useFolderStore } from "@repo/store";
import { MouseEventHandler, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { CreateBookmarkPayload, Folder } from "@repo/types";

export function BookmarkModal({
  parentFolder,
  folders,
}: {
  parentFolder?: string | null;
  folders?: Folder[];
}) {
  const { setShowBookmarkModal, showBookmarkModal, loading } = useUiStore();
  const { addBookmark } = useBookmarkStore();
  const [type, setType] = useState<"url" | "notes">("url");
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      const value = tagInput.trim();
      if (value && !tags.includes(value)) {
        if (tags.length < 3) {
          setTags([...tags, value]);
        } else {
          toast.error("You can add up to 3 tags only.");
        }
      }
      setTagInput("");
    }
  };

  const currentFolderId = useFolderStore.getState().currentFolder?.id;

  useEffect(() => {
    if (!folders || folders.length === 0) return;

    // prefer explicit parentFolder (if parentFolder is an id),
    // otherwise prefer the current folder from the store,
    // otherwise fallback to first folder
    const initial =
      (parentFolder && parentFolder) || currentFolderId || folders[0]?.id || "";
    setSelectedFolder(initial);
  }, [folders, parentFolder, currentFolderId, showBookmarkModal]);

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (type === "url" && !url.trim()) {
      toast.error("URL is required.");
      return;
    }
    if (type === "notes") {
      if (!notes.trim()) {
        toast.error("Notes are required.");
        return;
      }
      if (notes.length > 2000) {
        toast.error("Notes cannot exceed 2000 characters.");
        return;
      }
    }

    const currentFolderId = useFolderStore.getState().currentFolder?.id;
    const chosenFolderId =
      selectedFolder || currentFolderId || folders?.[0]?.id;

    if (!chosenFolderId) {
      toast.error("Please select a folder.");
      return;
    }

    const payload: CreateBookmarkPayload =
      type === "url"
        ? { type: "url", title, url, folderId: selectedFolder, tags }
        : { type: "notes", title, notes, folderId: selectedFolder, tags };

    toast.promise(
      addBookmark(payload).then(() => {
        if (!loading) {
          setShowBookmarkModal(false);
          setTitle("");
          setUrl("");
          setNotes("");
          setTags([]);
          setTagInput("");
          setSelectedFolder(currentFolderId || folders?.[0]?.id || "");
          setType("url");
        }
      }),
      {
        loading: "Creating bookmark...",
        success: "Bookmark created successfully!",
        error: "Failed to create bookmark.",
      }
    );
  };

  const nameCounts = useMemo(() => {
    const map = new Map<string, number>();
    folders?.forEach((f) => map.set(f.name, (map.get(f.name) || 0) + 1));
    return map;
  }, [folders]);

  function disambiguator(folder: Folder) {
    if (!nameCounts.get(folder.name) || nameCounts.get(folder.name) === 1)
      return "";
    // if slug started with name- remove that prefix
    const suffix = folder.slug?.startsWith(`${folder.name}-`)
      ? folder.slug.slice(folder.name.length + 1)
      : folder.slug?.split("-").pop();
    return suffix ? ` — ${suffix.slice(0, 6)}` : ` (${folder.id.slice(0, 6)})`;
  }

  return (
    <>
      {showBookmarkModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          onClick={() => setShowBookmarkModal(false)}
        >
          <div
            className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-700 
            rounded-xl p-6 max-w-md w-full mx-4 shadow-lg transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-gray-100">
              Create New Bookmark
            </h2>

            {/* Title */}
            <label className="block mb-1 text-gray-700 dark:text-gray-300 text-sm font-medium">
              Title (optional)
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 
              p-2 mb-4 bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 
              focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
              placeholder="Enter bookmark title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* URL */}
            {type === "url" && (
              <>
                <label className="block mb-1 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  URL
                </label>
                <input
                  type="url"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                  p-2 mb-4 bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 
                  focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                  placeholder="www.example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </>
            )}

            {/* Folder */}
            <label className="block mb-1 text-gray-700 dark:text-gray-300 text-sm font-medium">
              Select Folder
            </label>
            <select
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 
              p-2 mb-4 bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 
              focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
              value={selectedFolder || ""}
              onChange={(e) => setSelectedFolder(e.target.value)}
            >
              {folders?.map((folder) => (
                <option
                  key={folder.id}
                  value={folder.id}
                  title={folder.slug || folder.id}
                >
                  {folder.name}
                  {disambiguator(folder)}
                  {folder._count ? ` (${folder._count.bookmarks})` : ""}
                </option>
              ))}
            </select>

            {/* Type */}
            <label className="block mb-1 text-gray-700 dark:text-gray-300 text-sm font-medium">
              Type
            </label>
            <div className="flex mb-4 space-x-2">
              {["url", "notes"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t as "url" | "notes");
                    setUrl("");
                    setNotes("");
                  }}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    type === t
                      ? "bg-gradient-to-r from-[#ddba0e] via-[#f59e0b] to-[#d97706] text-white border-none"
                      : "bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  }`}
                >
                  {t === "url" ? "URL" : "Notes"}
                </button>
              ))}
            </div>

            {/* Tags */}
            <label className="block mb-1 text-gray-700 dark:text-gray-300 text-sm font-medium">
              Tags (optional)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Press Enter to add tag"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 
              p-2 mb-2 bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 
              focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center bg-gray-100 dark:bg-gray-700 
                    text-gray-800 dark:text-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Notes */}
            {type === "notes" && (
              <>
                <label className="block mb-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Notes
                </label>
                <textarea
                  rows={4}
                  maxLength={2000}
                  placeholder="Enter your notes here..."
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 
                  p-2 mb-2 bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 
                  focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <p className="text-right text-sm text-gray-500 dark:text-gray-400">
                  {notes.length} / 2000
                </p>
              </>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-5 py-2 rounded-md bg-gray-200 text-gray-900 border border-gray-300 
                hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 
                dark:hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => setShowBookmarkModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 rounded-md bg-gradient-to-r from-[#ddba0e] via-[#f59e0b] to-[#d97706] 
                text-white hover:opacity-90 transition-all cursor-pointer ${
                  loading ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Saving...
                  </span>
                ) : (
                  "Save Bookmark"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
