import type { Bookmark } from "./bookmark";

export interface Folder {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  color?: string | null;
  _count: {
    bookmarks: number;
  };
  createdAt: string;
  userId: string;
  parentId?: string;
  children?: Folder[];
  bookmarks?: Bookmark[];
}

export interface CreateFolderPayload {
  name: string;
  icon?: string;
  color?: string;
  parentId?: string | null;
}

export interface UpdateFolderPayload extends CreateFolderPayload {
  id: string;
}

export interface DeleteFolderPayload {
  id: string;
}
