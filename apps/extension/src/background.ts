// apps/extension/src/background.ts
import { getFolders, createBookmark } from "@repo/api-client";
import type { BackgroundMessage, BackgroundResponse } from "./types";

const WEB_APP_URL = import.meta.env.VITE_WEB_APP_URL;

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({
      url: `${WEB_APP_URL}/login?source=extension`,
    });
  }
});

chrome.runtime.onMessage.addListener(
  (
    message: BackgroundMessage,
    _sender,
    sendResponse: (response: BackgroundResponse) => void
  ) => {
    switch (message.type) {
      case "FETCH_FOLDERS":
        getFolders()
          .then((res) => sendResponse({ folders: res.folders }))
          .catch(() => sendResponse({ error: "Failed to fetch folders." }));
        return true;

      case "GET_CURRENT_TAB":
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          sendResponse({ tab: tabs[0] || null });
        });
        return true;

      case "ADD_BOOKMARK":
        createBookmark(message.payload)
          .then(() => sendResponse({ success: true }))
          .catch(() => sendResponse({ error: "Failed to add bookmark." }));
        return true;

      case "GET_SESSION":
        fetch(`${import.meta.env.VITE_API_URL}/get-session`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => sendResponse({ user: data.user || null }))
          .catch(() => sendResponse({ user: null }));
        return true;

      default:
        console.warn("Unhandled message:", message);
        return false;
    }
  }
);
