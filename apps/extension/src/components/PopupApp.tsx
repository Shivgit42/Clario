// apps/extension/src/components/PopupApp.tsx
import { useEffect, useState } from "react";
import FloatingBookmarkButton from "../content/FloatingBookmarkButton";
import type { Folder } from "@repo/types";
import { sendBackgroundMessage } from "../popupHelpers";
import type { BackgroundResponse } from "../types";
import { RequireAuth } from "./RequireAuth";

export default function PopupApp() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    sendBackgroundMessage({ type: "FETCH_FOLDERS" })
      .then((res: BackgroundResponse) => {
        if ("folders" in res) setFolders(res.folders);
        else if ("error" in res)
          setNotification({ message: res.error, type: "error" });
      })
      .catch((err) =>
        setNotification({
          message: "Could not communicate with background script.",
          type: "error",
        })
      );
  }, []);

  const handleAddBookmark = async (payload: any) => {
    try {
      const res = await sendBackgroundMessage({
        type: "ADD_BOOKMARK",
        payload,
      });
      if ("success" in res && res.success)
        setNotification({ message: "Bookmark added!", type: "success" });
      else if ("error" in res)
        setNotification({ message: res.error, type: "error" });
    } catch {
      setNotification({ message: "Could not add bookmark.", type: "error" });
    }
  };

  return (
    <RequireAuth>
      <FloatingBookmarkButton
        folders={folders}
        notification={notification}
        setNotification={setNotification}
        onAddBookmark={handleAddBookmark}
      />
    </RequireAuth>
  );
}
