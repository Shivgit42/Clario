// packages/api-client/src/config.ts

let API_URL: string;

if (typeof window !== "undefined" && "VITE_API_URL" in import.meta.env) {
  // running in Vite (browser/extension)
  API_URL = import.meta.env.VITE_API_URL;
} else {
  // running in Node/Next.js
  API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
}

export { API_URL };
