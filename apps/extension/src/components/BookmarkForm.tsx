import { useBookmarkStore, useFolderStore } from "@repo/store";
import type { CreateBookmarkPayload } from "@repo/types";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

export function BookmarkForm({
  activeTab,
  tabInfo,
}: {
  activeTab: "url" | "note";
  tabInfo: { title: string; url: string; favIconUrl?: string };
}) {
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [title, setTitle] = useState(tabInfo.title);
  const [url, setUrl] = useState(tabInfo.url);
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { addBookmark, loading } = useBookmarkStore();
  const { fetchFolders, folders } = useFolderStore();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    setTitle(tabInfo.title);
    setUrl(tabInfo.url);
    if (activeTab === "note") {
      setTitle("");
    }
  }, [tabInfo.title, tabInfo.url, activeTab]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (activeTab === "url" && !url.trim()) {
      setError("URL is required.");
      return;
    }
    if (activeTab === "url" && !/^https?:\/\//i.test(url)) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }
    if (!selectedFolder.trim()) {
      setError("Please select a folder.");
      return;
    }

    if (activeTab === "note") {
      if (!notes.trim()) {
        setError("Notes are required.");
        return;
      }
      if (notes.length > 2000) {
        setError("Notes cannot exceed 2000 characters.");
        return;
      }
    }

    const payload: CreateBookmarkPayload =
      activeTab === "url"
        ? {
            type: "url",
            title,
            url,
            folderId: selectedFolder,
            tags,
          }
        : {
            type: "notes",
            title,
            notes,
            folderId: selectedFolder,
            tags,
          };

    try {
      await addBookmark(payload);

      const folderName =
        folders.find((f) => f.id === selectedFolder)?.name || "folder";
      setSuccess(`Bookmark saved to ${folderName}!`);

      setTitle("");
      setUrl("");
      setNotes("");
      setSelectedFolder("");
      setTags([]);
      setTagInput("");
    } catch (error) {
      console.error("Error adding bookmark:", error);
      setError("Failed to save bookmark. Please try again.");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      const value = tagInput.trim();
      if (value && !tags.includes(value)) {
        if (tags.length < 3) {
          setTags([...tags, value]);
        } else {
          setError("You can add up to 3 tags only.");
        }
      }
      setTagInput("");
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="title" className="block text-sm font-medium mt-2 mb-1">
          Title (optional)
        </label>
        <input
          type="text"
          id="title"
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full placeholder-gray-400 dark:placeholder-gray-500 mb-2"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {activeTab === "url" && (
          <div>
            <label htmlFor="url" className="text-sm font-medium mb-1">
              URL
            </label>
            <input
              type="text"
              id="url"
              className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Enter URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        )}
        {activeTab === "note" && (
          <div>
            <label htmlFor="note" className="block text-sm font-medium mb-1">
              Note
            </label>
            <textarea
              id="note"
              className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Enter notes here..."
              rows={4}
              maxLength={2000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <p className="text-right text-sm font-medium text-gray-500 dark:text-gray-400">
              {notes.length} / 2000
            </p>
          </div>
        )}
        <label htmlFor="folder" className="block text-sm font-medium mt-2 mb-1">
          Folder
        </label>
        <select
          id="folder"
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full appearance-none bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-gray-100"
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
        >
          <option
            value=""
            disabled
            className="bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-gray-100"
          >
            Select a folder
          </option>
          {folders &&
            folders.map((folder) => (
              <option
                key={folder.id}
                value={folder.id}
                className="bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-gray-100"
              >
                {folder.name}
              </option>
            ))}
        </select>
        <label htmlFor="tags" className="block text-sm font-medium mt-2 mb-1">
          Tags (optional)
        </label>
        <input
          type="text"
          id="tags"
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full placeholder-gray-500"
          placeholder="Enter tags separated by commas"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 cursor-pointer"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm mt-2 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
            <Check className="size-4" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm mt-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            <X className="size-4" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded w-full transition-colors"
        >
          {loading ? "Saving..." : "Save Bookmark"}
        </button>
      </form>
    </div>
  );
}
