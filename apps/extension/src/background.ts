// apps/extension/src/background.ts
import { getFolders, createBookmark } from "@repo/api-client";
import type { BackgroundMessage, BackgroundResponse } from "./types";
import type { User } from "@repo/store";

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
          .then(async (res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch session: ${res.status}`);
            }
            const data = await res.json();

            // Safely map response into User type
            const user: User = data?.user
              ? {
                  id: data.user.id,
                  name: data.user.name,
                  email: data.user.email,
                  emailVerified: Boolean(data.user.emailVerified),
                  createdAt: new Date(data.user.createdAt),
                  updatedAt: new Date(data.user.updatedAt),
                  image: data.user.image ?? null,
                }
              : null;

            sendResponse({ user });
          })
          .catch((err) => {
            console.error("GET_SESSION error:", err);
            sendResponse({ user: null });
          });
        return true;

      default:
        console.warn("Unhandled message:", message);
        return false;
    }
  }
);
