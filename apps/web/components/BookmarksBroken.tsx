"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const tabs = [
  {
    id: "problem",
    label: "Bookmarks Are Broken",
    heading: "Bookmarks Are Broken.",
    description:
      "Browsers, devices, tabs — they don't talk. Your bookmarks are scattered, hard to find, and impossible to organize.",
    video: "/videos/broken-bookmarks.mp4",
    dark: false,
  },
  {
    id: "solution",
    label: "Clario Fixes That",
    heading: "Clario Fixes That",
    description:
      "One extension. One dashboard. A single home for all your bookmarks and notes — across every browser and device.",
    video: "/videos/Clario.mp4",
    dark: true,
  },
];

export default function BookmarksBroken() {
  const [active, setActive] = useState("problem");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a skeleton
  }
  const activeTab = tabs.find((t) => t.id === active);

  return (
    <section className="px-6 md:px-12 lg:px-20 py-20">
      <div className="max-w-5xl mx-auto bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl overflow-hidden">
        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex-1 py-4 font-semibold text-sm sm:text-base transition-colors ${
                active === tab.id
                  ? "bg-gradient-to-r from-[#ddba0e] via-[#f59e0b] to-[#d97706] text-black"
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          className={`p-8 md:p-12 flex flex-col lg:flex-row items-center gap-10 ${
            activeTab?.dark ? "bg-black text-white" : "bg-[#F8F9FD] text-black"
          }`}
        >
          <div className="flex-1">
            <h2 className="text-2xl sm:text-4xl font-bold">
              {activeTab?.heading}
            </h2>
            <p
              className={`mt-3 text-sm sm:text-base leading-relaxed ${
                activeTab?.dark
                  ? "text-gray-300"
                  : "text-gray-600 dark:text-black/60"
              }`}
            >
              {activeTab?.description}
            </p>

            {active === "solution" && (
              <Link
                href="/login"
                className="inline-block mt-6 px-5 py-3 bg-gradient-to-r from-[#ddba0e] via-[#f59e0b] to-[#d97706] text-black font-semibold rounded-xl shadow-lg hover:opacity-90 transition"
              >
                Try Clario Free
              </Link>
            )}
          </div>

          <div className="flex-1 w-full">
            <video
              src={activeTab?.video}
              autoPlay
              muted
              loop
              playsInline
              className="rounded-2xl w-full h-64 sm:h-80 object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
