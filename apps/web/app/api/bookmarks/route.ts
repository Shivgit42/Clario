import { prismaClient } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../lib/middleware";
import { getLinkPreview } from "link-preview-js";
import { z } from "zod";

import type {
  CreateBookmarkPayload,
  DeleteBookmarkPayload,
  UpdateBookmarkPayload,
} from "@repo/types";

type previewDataType = {
  title?: string;
  description?: string;
  images?: string[];
  favicons?: string[];
};

const urlBookmarkSchema = z.object({
  type: z.literal("url"),
  url: z.string().url(),
  title: z.string().max(255).optional(),
  folderId: z.string().uuid(),
  tags: z
    .array(z.string())
    .max(3, { message: "You can add up to 3 tags only." })
    .optional(),
  previewImage: z.string().url().optional(),
});

const noteBookmarkSchema = z.object({
  type: z.literal("notes"),
  title: z.string().max(255),
  notes: z
    .string()
    .max(2000, { message: "Notes cannot exceed 2000 characters." }),
  folderId: z.string().uuid(),
  tags: z
    .array(z.string())
    .max(3, { message: "You can add up to 3 tags only." })
    .optional(),
});

const bookmarkSchema = z.discriminatedUnion("type", [
  urlBookmarkSchema,
  noteBookmarkSchema,
]);

async function getTwitterPreview(url: string): Promise<string | null> {
  try {
    console.log("🐦 Fetching Twitter preview for:", url);

    // Extract tweet ID from URL
    const tweetIdMatch = url.match(/status\/(\d+)/);
    if (!tweetIdMatch) {
      console.log("❌ Could not extract tweet ID");
      return null;
    }

    const tweetId = tweetIdMatch[1];

    // Try oEmbed API first
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`;
    const response = await fetch(oembedUrl);

    console.log("📊 Twitter API response status:", response.status);

    if (!response.ok) {
      console.log("❌ Twitter API returned non-ok status");
      return null;
    }

    const data = await response.json();
    console.log("📦 Twitter oEmbed data:", data);

    // Try to extract profile image from the author_url
    if (data.author_url) {
      const username = data.author_url.split("/").pop();
      // Use Twitter's avatar API endpoint
      const avatarUrl = `https://unavatar.io/twitter/${username}`;
      console.log("🖼️ Using avatar thumbnail:", avatarUrl);
      return avatarUrl;
    }

    return null;
  } catch (error) {
    console.error("❌ Error fetching Twitter preview:", error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session || !session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL(req.url);
    const folderId = url.searchParams.get("folderId");
    if (!folderId) {
      return NextResponse.json(
        { error: "Folder ID is required" },
        { status: 400 }
      );
    }
    const bookmarks = await prismaClient.bookmark.findMany({
      where: {
        userId: session.user.id,
        folderId: folderId,
      },
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ bookmarks }, { status: 200 });
  } catch (error) {
    console.error("Error in bookmarks API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session || !session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateBookmarkPayload = await req.json();

    const validation = bookmarkSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues },
        { status: 400 }
      );
    }

    const bookmarkData = validation.data;
    let createdBookmark;

    if (bookmarkData.type === "url") {
      const { url, title, folderId, tags } = bookmarkData;

      const isTwitterUrl =
        (url.includes("twitter.com") || url.includes("x.com")) &&
        url.includes("/status/");

      const [previewData, twitterPreview]: [
        previewDataType | null,
        string | null,
      ] = await Promise.all([
        getLinkPreview(url).catch((error) => {
          console.error("Error fetching link preview:", error);
          return null;
        }) as Promise<previewDataType | null>,
        isTwitterUrl ? getTwitterPreview(url) : Promise.resolve(null),
      ]);

      createdBookmark = await prismaClient.bookmark.create({
        data: {
          type: "url",
          title: title || previewData?.title || "Untitled",
          url,
          notes: null,
          previewImage:
            bookmarkData.previewImage ||
            twitterPreview ||
            previewData?.images?.[0] ||
            null,
          favicon: previewData?.favicons?.[0] || null,
          folderId,
          userId: session.user.id,
          tags: {
            connectOrCreate:
              tags?.map((tagName) => ({
                where: {
                  name_userId: {
                    name: tagName,
                    userId: session.user.id,
                  },
                },
                create: {
                  name: tagName,
                  userId: session.user.id,
                },
              })) || [],
          },
        },
        include: { tags: true },
      });
    } else if (bookmarkData.type === "notes") {
      const { title, notes, folderId, tags } = bookmarkData;

      createdBookmark = await prismaClient.bookmark.create({
        data: {
          type: "notes",
          title: title || "Untitled Note",
          url: null,
          notes,
          folderId,
          userId: session.user.id,
          tags: {
            connectOrCreate:
              tags?.map((tagName) => ({
                where: {
                  name_userId: {
                    name: tagName,
                    userId: session.user.id,
                  },
                },
                create: {
                  name: tagName,
                  userId: session.user.id,
                },
              })) || [],
          },
        },
        include: { tags: true },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid bookmark type" },
        { status: 400 }
      );
    }

    return NextResponse.json({ bookmark: createdBookmark }, { status: 201 });
  } catch (error) {
    console.error("Error in bookmarks API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session || !session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body: UpdateBookmarkPayload = await req.json();
    const { id, url, notes, folderId } = body;

    const validation = bookmarkSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues },
        { status: 400 }
      );
    }

    const bookmark = await prismaClient.bookmark.update({
      where: { id },
      data: {
        url,
        notes,
        folderId: folderId || null,
      },
    });
    return NextResponse.json({ bookmark }, { status: 200 });
  } catch (error) {
    console.error("Error in bookmarks API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session || !session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body: DeleteBookmarkPayload = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Bookmark ID is required" },
        { status: 400 }
      );
    }

    await prismaClient.bookmark.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Bookmark deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in bookmarks API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
