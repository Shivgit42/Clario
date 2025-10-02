"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    setImageSrc(isDark ? "/hero-dark.png" : "/hero-light.png");
  }, [isDark]);

  if (!imageSrc) return null;

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-5 md:px-10 lg:px-20 mt-32">
      {/* Headline */}
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl">
        Bookmarks Made Simple
      </h1>

      {/* Subtext */}
      <p className="mt-4 text-sm md:text-lg text-muted-foreground max-w-xl mx-auto leading-6">
        Clario brings all your bookmarks & notes together. Save instantly,
        search easily, and stay organized — across every device.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-4 justify-center items-center mt-8">
        <Link
          href="/dashboard"
          className="px-5 py-3 rounded-xl shadow-md text-black font-semibold bg-gradient-to-r from-[#ddba0e] via-[#f59e0b] to-[#d97706]
 hover:opacity-90 transition text-sm md:text-base"
        >
          Open Dashboard
        </Link>
        <a
          href="#"
          className="group relative px-5 py-3 rounded-xl shadow-md text-sm md:text-base font-semibold bg-black text-white dark:bg-white dark:text-black transition duration-300 overflow-hidden"
          onClick={(e) => e.preventDefault()}
        >
          <span className="block transition-all duration-300 group-hover:-translate-y-10">
            Install Extension
          </span>
          <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            Coming Soon
          </span>
        </a>
      </div>

      {/* Hero Image */}
      <div className="relative w-full lg:w-[1100px] mt-12">
        <div className="relative rounded-3xl p-[2px] bg-gradient-to-r from-[#ddba0e] via-[#f59e0b] to-[#d97706] shadow-[0_0_40px_rgba(221,186,14,0.35)]">
          <Image
            src={imageSrc}
            alt="Clario preview"
            width={1200}
            height={700}
            layout="responsive"
            className="rounded-3xl border border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>
    </section>
  );
}
