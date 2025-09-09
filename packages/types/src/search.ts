export interface SearchPayload {
  q: string;
  scope: "dashboard" | "folder";
  folderId: string;
}

export type SearchResult =
  | {
      id: string;
      type: "bookmark";
      favicon: string | null;
      title: string;
      url: string | null;
      notes: string | null;
      bookmarkType: string;
      folderId: string | null;
      tags: { id: string; name: string }[];
    }
  | {
      id: string;
      type: "folder";
      name: string;
      slug: string;
      color?: string | null;
      icon?: string | null;
      createdAt: string;
      parentId: string | null;
    };
