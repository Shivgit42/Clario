export type BookmarkType = "url" | "notes";

export interface UrlBookmarkPayload {
  type: "url";
  title?: string;
  url: string;
  folderId: string;
  tags?: string[];
  previewImage?: string;
}

export interface NoteBookmarkPayload {
  type: "notes";
  title?: string;
  notes: string;
  folderId: string;
  tags?: string[];
}

export type CreateBookmarkPayload = UrlBookmarkPayload | NoteBookmarkPayload;

export interface Tag {
  id: string;
  name: string;
  userId: string;
}

export interface Bookmark {
  id: string;
  type: BookmarkType;
  title: string;
  url: string | null;
  notes: string | null;
  previewImage?: string | null;
  favicon?: string | null;
  folderId: string;
  userId: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface DeleteBookmarkPayload {
  id: string;
}

export interface UpdateBookmarkPayload {
  id: string;
  type?: BookmarkType;
  title?: string;
  url?: string | null;
  notes?: string | null;
  tags?: string[];
  folderId: string | null;
}

export interface recentBookmark {
  id: string;
  type: BookmarkType;
  title: string;
  favicon?: string | null;
  url: string | null;
  notes: string | null;
  folderId: string;
}
