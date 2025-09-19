import { Save, Folder, Monitor, Search, Sparkles, Lock } from "lucide-react";

const features = [
  {
    icon: <Save size={28} className="text-[#ddba0e]" />,
    title: "One-Click Save",
    description: "Capture any page instantly with a single click.",
  },
  {
    icon: <Folder size={28} className="text-[#ddba0e]" />,
    title: "Smart Folders",
    description: "Organize bookmarks into clean, custom folders.",
  },
  {
    icon: <Monitor size={28} className="text-[#ddba0e]" />,
    title: "Cross-Device Sync",
    description: "Your bookmarks stay updated everywhere.",
  },
  {
    icon: <Search size={28} className="text-[#ddba0e]" />,
    title: "Instant Search",
    description: "Find anything you saved — in seconds.",
  },
  {
    icon: <Sparkles size={28} className="text-[#ddba0e]" />,
    title: "Notes & Highlights",
    description: "Save ideas, not just links.",
  },
  {
    icon: <Lock size={28} className="text-[#ddba0e]" />,
    title: "Privacy First",
    description: "Your data is yours, always private and secure.",
  },
];

export default function Features() {
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-bold">Key Features</h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          Everything you need to save smarter and stay organized.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="group relative flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181818] shadow-sm transition-transform duration-300 ease-out hover:shadow-[0_0_25px_rgba(221,186,14,0.4)] hover:border-[#ddba0e]"
          >
            {/* Glow overlay (subtle golden gradient on hover) */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#ddba0e]/20 via-transparent to-[#f59e0b]/20 pointer-events-none"></div>

            <div className="mb-3 relative z-10">{f.icon}</div>
            <h3 className="font-semibold text-lg relative z-10">{f.title}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 relative z-10">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
