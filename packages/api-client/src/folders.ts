import { apiClient } from "./api";
import type {
  CreateFolderPayload,
  DeleteFolderPayload,
  UpdateFolderPayload,
} from "@repo/types";

export const getFolders = async () => {
  try {
    const response = await apiClient.get(`/folders`);
    return response.data;
  } catch (error: Error | any) {
    console.error("Error fetching folders:", error);
    throw new Error(error.response?.data?.error || "Failed to fetch folders");
  }
};

export const createFolder = async (folderData: CreateFolderPayload) => {
  try {
    const response = await apiClient.post(`/folders`, folderData);
    return response.data;
  } catch (error: Error | any) {
    console.error("Error creating folders:", error);
    throw new Error(error.response?.data?.error || "Failed to create folders");
  }
};

export const updateFolder = async (folderData: UpdateFolderPayload) => {
  try {
    const response = await apiClient.put(`/folders`, folderData);
    return response.data;
  } catch (error: Error | any) {
    console.error("Error updating folders:", error);
    throw new Error(error.response?.data?.error || "Failed to update folders");
  }
};

export const deleteFolder = async (folderData: DeleteFolderPayload) => {
  try {
    const response = await apiClient.delete(`/folders`, { data: folderData });
    return response.data;
  } catch (error: Error | any) {
    console.error("Error deleting folders:", error);
    throw new Error(error.response?.data?.error || "Failed to delete folders");
  }
};

export const resolveFolderPath = async (slugs: string[]) => {
  try {
    const queryParam = slugs.join(",");
    const response = await apiClient.get(`/folders/resolve-path`, {
      params: { slugs: queryParam },
    });
    return response.data;
  } catch (error: Error | any) {
    console.error("Error resolving folder path:", error);
    throw new Error(
      error.response?.data?.error || "Failed to resolve folder path"
    );
  }
};

export const getSubfolders = async (parentId: string) => {
  try {
    const response = await apiClient.get(`/folders/subfolders`, {
      params: parentId,
    });
    return response.data;
  } catch (error: Error | any) {
    console.error("Error fetching subfolders:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch subfolders"
    );
  }
};
