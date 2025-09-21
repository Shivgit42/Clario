// packages/api-client/env.d.ts
export {};

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly NEXT_PUBLIC_API_URL?: string;
    // add any other public vars you expect to read
    // readonly VITE_SOME_OTHER?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
