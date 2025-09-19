"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "../../lib/auth-client";
import { GoogleIcon } from "../../public/icons/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "../../components/Theme-toggle";

export default function LoginPage() {
  const [isExtensionLogin, setIsExtensionLogin] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const handleGoogleLogin = async () => {
    if (window.location.search.includes("source=extension")) {
      setIsExtensionLogin(true);
    }
    await signIn.social({
      provider: "google",
      callbackURL: isExtensionLogin
        ? "/login/extension-callback"
        : "/dashboard",
      errorCallbackURL: "/auth/error",
    });
  };

  useEffect(() => {
    if (session && session.user) {
      if (isExtensionLogin) {
        router.push("/login/extension-callback");
      } else {
        router.push("/dashboard");
      }
    }
  }, [session, isPending, isExtensionLogin, router]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("source") === "extension") {
      setIsExtensionLogin(true);
    }
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-gradient-to-br from-[#f8f9fd] via-white to-[#eef2f8] dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#111]">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Center card */}
      <div className="flex flex-grow flex-col justify-center items-center px-4">
        <div className="backdrop-blur-md bg-white/70 dark:bg-black/40 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl p-8 w-full max-w-sm text-center">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#ddba0e] via-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">
            {isExtensionLogin ? "Connect Clario Extension" : "Login to Clario"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {isExtensionLogin
              ? "Sign in to sync your extension with your Clario account."
              : "Access your bookmarks, notes, and dashboard with one login."}
          </p>

          {/* Google login button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 font-medium text-gray-800 dark:text-gray-100 bg-white dark:bg-[#222] hover:border-[#f59e0b] hover:shadow-lg cursor-pointer"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-2 mb-6 text-xs text-gray-600 dark:text-gray-400">
        <Link href="/" className="hover:underline text-lg">
          Return home
        </Link>
        <div className="flex gap-3">
          <Link href="#" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
