import { useEffect, useState } from "react";
import Loading from "./Loading";
import { sendBackgroundMessage } from "../popupHelpers";
import type { BackgroundResponse } from "../types";
import type { User } from "@repo/store";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);

  const apiUrl = import.meta.env.VITE_WEB_APP_URL;

  useEffect(() => {
    sendBackgroundMessage({ type: "GET_SESSION" })
      .then((res: BackgroundResponse) => {
        if ("user" in res) setSession(res.user);
      })
      .catch(() => setSession(null))
      .finally(() => setIsPending(false));
  }, []);

  if (isPending) return <Loading />;

  if (!session) {
    return (
      <div className="w-80 h-[450px] flex flex-col items-center justify-center bg-[#2A2A2A] px-4 text-center">
        <p className="text-gray-300 text-sm mb-4">
          Log in to Clario to save and manage your bookmarks.
        </p>
        <a
          href={`${apiUrl}/login?source=extension`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Log in to Clario
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
