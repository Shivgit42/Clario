import type { BackgroundMessage, BackgroundResponse } from "./types";

export function sendBackgroundMessage<T extends BackgroundMessage>(
  message: T
): Promise<BackgroundResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      resolve(response);
    });
  });
}
