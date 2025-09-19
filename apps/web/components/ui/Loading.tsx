export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fffbea] via-white to-[#fffaf0] dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#111]">
      <div className="flex flex-col items-center text-center">
        {/* Spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#f59e0b]"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#ddba0e]"></div>
        </div>

        {/* Text */}
        <p className="mt-6 text-gray-700 dark:text-gray-300 font-medium tracking-wide">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
}
