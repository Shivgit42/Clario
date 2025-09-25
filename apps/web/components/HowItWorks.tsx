"use client";
import { useEffect, useState } from "react";

const steps = [
  {
    title: "Install Clario",
    description:
      "Get started in one click. Install the extension and sign in to sync your bookmarks and notes.",
    videoSrc:
      "https://res.cloudinary.com/dc0r1vikq/video/upload/v1755950771/add_to_browser_720p_mymel3.mp4",
    poster:
      "https://res.cloudinary.com/dc0r1vikq/video/upload/f_auto,q_auto/v1755614332/add_to_browser_cmp_kiplxf.jpg",
  },
  {
    title: "Save Anything Instantly",
    description:
      "Capture links or quick notes from any page using the floating button or popup.",
    videoSrc:
      "https://res.cloudinary.com/dcmziintu/video/upload/v1758777278/VN20250925_101219_x9wieg.mp4",
    poster:
      "https://res.cloudinary.com/dcmziintu/video/upload/v1758777278/VN20250925_101219_x9wieg.mp4",
  },
  {
    title: "Organize & Search Effortlessly",
    description:
      "Your dashboard keeps everything in one place. Organize with folders and find things instantly.",
    videoSrc:
      "https://res.cloudinary.com/dcmziintu/video/upload/v1758777694/VN20250925_102059_gtq7he.mp4",
    poster:
      "https://res.cloudinary.com/dcmziintu/image/upload/v1758777797/Screenshot_458_wxfmy1.png",
  },
];

export default function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleStepChange = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 mt-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
          How Clario Works
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          Explore the steps — click or hover to preview.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-10 bg-white dark:bg-[#1c1c1c] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
        {/* Left side: Steps list */}
        <div className="flex-1 space-y-6">
          {steps.map((step, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={index}
                onMouseEnter={() => handleStepChange(index)}
                onClick={() => handleStepChange(index)}
                className={`cursor-pointer p-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#ddba0e] via-[#f59e0b] to-[#d97706] text-black shadow-lg"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-black" : "text-[#ddba0e]"
                  }`}
                >
                  Step {index + 1}
                </span>
                <h3 className="text-xl font-semibold mt-1">{step.title}</h3>
                <p
                  className={`mt-1 text-sm leading-relaxed ${
                    isActive
                      ? "text-black/80"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right side: Active video */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 relative">
            {steps.map((step, index) => (
              <video
                key={index}
                src={step.videoSrc}
                poster={step.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
                  activeIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
