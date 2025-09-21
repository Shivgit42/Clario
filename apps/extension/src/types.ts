// apps/extension/src/types.ts
import type { User } from "@repo/store";
import type { CreateBookmarkPayload, Folder } from "@repo/types";

// All messages sent to background
export type BackgroundMessage =
  | { type: "FETCH_FOLDERS" }
  | { type: "GET_CURRENT_TAB" }
  | { type: "ADD_BOOKMARK"; payload: CreateBookmarkPayload } // Replace 'any' with your bookmark type
  | { type: "GET_SESSION" };

// All possible responses from background
export type BackgroundResponse =
  | { folders: Folder[] }
  | { tab: chrome.tabs.Tab | null }
  | { success: true; bookmarkId?: string }
  | { error: string }
  | { user: User }; // Replace 'any' with your session user type
