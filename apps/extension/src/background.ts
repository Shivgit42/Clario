const WEB_APP_URL = import.meta.env.VITE_WEB_APP_URL;
import { getFolders, createBookmark } from "@repo/api-client";

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({
      url: `${WEB_APP_URL}/login?source=extension`,
    });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case "FETCH_FOLDERS":
      getFolders()
        .then((res) => sendResponse({ folders: res.folders }))
        .catch((error) => {
          console.error("Error fetching folders:", error);
          sendResponse({ error: "Failed to fetch folders." });
        });
      return true; // keep channel open

    case "GET_CURRENT_TAB":
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0] ?? null;
        sendResponse({ tab });
      });
      return true; // keep channel open

    case "ADD_BOOKMARK":
      createBookmark(message.payload)
        .then(() => sendResponse({ success: true }))
        .catch((error) => {
          console.error("Error adding bookmark:", error);
          sendResponse({ error: "Failed to add bookmark." });
        });
      return true; // keep channel open

    default:
      return false;
  }
});
