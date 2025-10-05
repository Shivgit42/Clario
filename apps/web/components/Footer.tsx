import { Github, Twitter } from "lucide-react";
import { Logo } from "./logo";
import Link from "next/link";
import ThemeToggle from "./Theme-toggle";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-[#111111] border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2">
            <Logo />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Clario
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 ml-1">
            Find it. Save it. Clario.
          </p>
          <div className="flex items-center gap-4 mt-4 ml-1">
            <a
              href="https://github.com/Shivgit42"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5 text-gray-500 hover:text-yellow-400" />
            </a>
            <a
              href="https://x.com/shivamranaaa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-5 w-5 text-gray-500 hover:text-yellow-400" />
            </a>
            <ThemeToggle />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <Link
              href="/dashboard"
              className="block text-gray-600 dark:text-gray-400 hover:text-yellow-400"
            >
              Dashboard
            </Link>
            <Link
              href="/privacy"
              className="block text-gray-600 dark:text-gray-400 hover:text-yellow-400"
            >
              Privacy Policy
            </Link>
            <a
              href="https://chromewebstore.google.com/detail/clario/ponmpddnllnnbagafncnlofljhmnhdgd"
              className="block text-gray-600 dark:text-gray-400 hover:text-yellow-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              Extension
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
