import { apiClient } from "./api";
import type {
  CreateBookmarkPayload,
  DeleteBookmarkPayload,
  UpdateBookmarkPayload,
} from "@repo/types";

export const getBookmarks = async (folderId: string) => {
  try {
    const response = await apiClient.get(`/bookmarks`, {
      params: { folderId },
    });
    return response.data;
  } catch (err: Error | any) {
    console.error("Error while fetching bookmarks", err);
    throw new Error(err.response?.data?.error || "Failed to fetch bookmarks");
  }
};

export const createBookmark = async (bookmarkData: CreateBookmarkPayload) => {
  try {
    const response = await apiClient.post(`/bookmarks`, bookmarkData);
    return response.data;
  } catch (err: Error | any) {
    console.error("Error while creating bookmark", err);
    throw new Error(err.response?.data?.error || "Failed to create bookmark");
  }
};

export const updateBookmark = async (bookmarkData: UpdateBookmarkPayload) => {
  try {
    const response = await apiClient.put(`/bookmarks`, bookmarkData);
    return response.data;
  } catch (err: Error | any) {
    console.error("Error while updating bookmark", err);
    throw new Error(err.response?.data?.error || "Failed to update bookmark");
  }
};

export const deleteBookmark = async (bookmarkData: DeleteBookmarkPayload) => {
  try {
    const response = await apiClient.delete(`/bookmarks`, {
      data: { id: bookmarkData.id },
    });
    return response.data;
  } catch (err: Error | any) {
    console.error("Error while deleting bookmark", err);
    throw new Error(err.response?.data?.error || "Failed to delete bookmark");
  }
};

export const getRecentBookmarks = async (limit: number = 10) => {
  try {
    const response = await apiClient.get(`/bookmarks/recent`, {
      params: limit,
    });
    return response.data;
  } catch (err: Error | any) {
    console.error("Error while fetching recent bookmark", err);
    throw new Error(
      err.response?.data?.error || "Failed to fetch recent bookmark"
    );
  }
};

export const getNoteById = async (id: string) => {
  try {
    const response = await apiClient.get(`/bookmarks/note`, {
      params: { id },
    });
    return response.data;
  } catch (err: Error | any) {
    console.error("Error while fetching bookmark by ID", err);
    throw new Error(
      err.response?.data?.error || "Failed to fetch bookmark by ID"
    );
  }
};
