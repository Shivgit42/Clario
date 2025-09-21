// apps/extension/src/types.ts
import type { Folder } from "@repo/types";

// All messages sent to background
export type BackgroundMessage =
  | { type: "FETCH_FOLDERS" }
  | { type: "GET_CURRENT_TAB" }
  | { type: "ADD_BOOKMARK"; payload: any } // Replace 'any' with your bookmark type
  | { type: "GET_SESSION" };

// All possible responses from background
export type BackgroundResponse =
  | { folders: Folder[] }
  | { tab: chrome.tabs.Tab | null }
  | { success: true }
  | { error: string }
  | { user: any }; // Replace 'any' with your session user type
