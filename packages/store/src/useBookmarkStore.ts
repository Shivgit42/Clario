import { create } from "zustand";
import {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  getRecentBookmarks,
  getNoteById,
} from "@repo/api-client";
import { useUiStore } from "./useUiStore";
import type {
  Bookmark,
  CreateBookmarkPayload,
  DeleteBookmarkPayload,
  recentBookmark,
  UpdateBookmarkPayload,
} from "@repo/types";
import { useFolderStore } from "./useFolderStore";

interface BookmarkStore {
  bookmarks: Bookmark[];
  notes: Bookmark | null;
  recentBookmarks: recentBookmark[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchBookmarks: (folderId: string) => Promise<void>;
  fetchNotes: (id: string) => Promise<Bookmark | undefined>;
  clearBookmarks: () => void;
  getRecentBookmarks: (limit: number) => Promise<void>;
  setRecentBookmarks: (bookmarks: recentBookmark[]) => void;
  addBookmark: (bookmarkData: CreateBookmarkPayload) => Promise<void>;
  editBookmark: (bookmarkData: UpdateBookmarkPayload) => Promise<void>;
  deleteBookmark: (bookmarkData: DeleteBookmarkPayload) => Promise<void>;
}

const { setError, setLoadingBookmarkSkeleton } = useUiStore.getState();

function detectType(url: string) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("twitter.com") && url.includes("/status/")) return "tweet";
  if (url.match(/\.(jpeg|jpg|png|webp|gif)$/)) return "image";
  if (url.endsWith(".svg")) return "svg";
  return "url";
}

function getYoutubeThumbnail(url: string): string | null {
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarks: [],
  notes: null,
  recentBookmarks: [],
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  fetchBookmarks: async (folderId) => {
    setLoadingBookmarkSkeleton(true);
    try {
      const { bookmarks } = await getBookmarks(folderId);
      set({ bookmarks });
    } catch (error: any) {
      console.error("Error fetching bookmarks:", error);
      setError(error.response?.data?.error || "Failed to fetch bookmarks");
    } finally {
      setLoadingBookmarkSkeleton(false);
    }
  },

  fetchNotes: async (id) => {
    setLoadingBookmarkSkeleton(true);
    try {
      const { bookmark } = await getNoteById(id);
      set({ notes: bookmark || null });
      return bookmark || null;
    } catch (error: any) {
      console.error("Error fetching note:", error);
      setError(error.response?.data?.error || "Failed to fetch note");
      return undefined;
    } finally {
      setLoadingBookmarkSkeleton(false);
    }
  },

  clearBookmarks: () => {
    set({ bookmarks: [] });
  },

  getRecentBookmarks: async (limit = 10) => {
    setLoadingBookmarkSkeleton(true);
    try {
      const { bookmarks } = await getRecentBookmarks(limit);
      set({ recentBookmarks: bookmarks });
    } catch (error: any) {
      console.error("Error fetching recent bookmarks:", error);
      setError(
        error.response?.data?.error || "Failed to fetch recent bookmarks"
      );
    } finally {
      setLoadingBookmarkSkeleton(false);
    }
  },

  setRecentBookmarks: (bookmarks) => {
    set({ recentBookmarks: bookmarks });
  },

  addBookmark: async (bookmarkData) => {
    set({ loading: true });
    try {
      let payload = { ...bookmarkData };

      if (payload.type === "url" && detectType(payload.url) === "youtube") {
        const thumbnail = getYoutubeThumbnail(payload.url);
        if (thumbnail) payload.previewImage = thumbnail;
      }

      console.log("createBookmark payload:", payload);
      const { bookmark } = await createBookmark(payload);
      console.log("createBookmark response:", bookmark);

      const currentFolderId = useFolderStore.getState().currentFolder?.id;

      // append to visible list only if viewing the same folder
      if (currentFolderId === bookmark.folderId) {
        set((state) => ({ bookmarks: [...(state.bookmarks || []), bookmark] }));
      }

      // update folder counts safely
      useFolderStore.setState((state: any) => {
        const updateFolderCount = (folders: any[] = []) =>
          folders.map((folder: any) =>
            folder.id === bookmark.folderId
              ? {
                  ...folder,
                  _count: { bookmarks: (folder._count?.bookmarks || 0) + 1 },
                }
              : folder
          );

        return {
          folders: updateFolderCount(state.folders),
          subfolders: state.subfolders
            ? updateFolderCount(state.subfolders)
            : state.subfolders,
        };
      });

      set((state) => ({
        recentBookmarks: [
          bookmark,
          ...state.recentBookmarks.filter((b) => b.id !== bookmark.id),
        ].slice(0, 5),
      }));
    } catch (error: any) {
      console.error("Error creating bookmark:", error);
      setError(error.response?.data?.error || "Failed to create bookmark");
    } finally {
      set({ loading: false });
    }
  },

  editBookmark: async (bookmarkData) => {
    set({ loading: true });
    try {
      const { bookmark } = await updateBookmark(bookmarkData);
      set((state) => ({
        bookmarks: state.bookmarks.map((b) =>
          b.id === bookmark.id ? bookmark : b
        ),
      }));
    } catch (error: any) {
      console.error("Error updating bookmark:", error);
      setError(error.response?.data?.error || "Failed to update bookmark");
    } finally {
      set({ loading: false });
    }
  },

  deleteBookmark: async (bookmarkData) => {
    set({ loading: true });
    try {
      await deleteBookmark(bookmarkData);
      set((state) => ({
        bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkData.id),
        recentBookmarks: state.recentBookmarks.filter(
          (b) => b.id !== bookmarkData.id
        ),
      }));

      useFolderStore.setState((state: any) => ({
        folders: state.folders.map((folder: any) => {
          if (folder.id === bookmarkData.id) {
            return {
              ...folder,
              _count: {
                bookmarks: folder._count.bookmarks - 1,
              },
            };
          }
          return folder;
        }),
        subfolders: state.subfolders?.map((folder: any) => {
          if (folder.id === bookmarkData.id) {
            return {
              ...folder,
              _count: {
                bookmarks: folder._count.bookmarks - 1,
              },
            };
          }
          return folder;
        }),
      }));
    } catch (error: any) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
