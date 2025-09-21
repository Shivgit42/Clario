import { useEffect, useState } from "react";
import FloatingBookmarkButton from "./FloatingBookmarkButton";
import type { Folder } from "@repo/types";
import { sendBackgroundMessage } from "../popupHelpers";

export function ContentPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    sendBackgroundMessage({ type: "FETCH_FOLDERS" })
      .then((res) => {
        if ("folders" in res) setFolders(res.folders);
        else if ("error" in res)
          setNotification({ message: res.error, type: "error" });
      })
      .catch((err) => {
        console.error("Background error:", err);
        setNotification({
          message: "Could not communicate with background script.",
          type: "error",
        });
      });
  }, []);

  return (
    <FloatingBookmarkButton
      folders={folders}
      notification={notification}
      setNotification={setNotification}
    />
  );
}
