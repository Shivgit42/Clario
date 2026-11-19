const isExtension =
  typeof window !== "undefined" &&
  typeof (window as any).chrome !== "undefined" &&
  (window as any).chrome.runtime &&
  (window as any).chrome.runtime.id;

const isDevelopment =
  !isExtension &&
  typeof window !== "undefined" &&
  window.location.hostname === "localhost";

export const API_URL = isExtension
  ? "https://clario.shivamrana.space/api"
  : isDevelopment
    ? "http://localhost:3000/api"
    : "https://clario.shivamrana.space/api";