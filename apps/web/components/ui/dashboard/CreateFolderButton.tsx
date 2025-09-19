import { useUiStore } from "@repo/store";
import { Plus } from "lucide-react";

export function CreateFolderButton({ className }: { className?: string }) {
  const { setShowFolderModal } = useUiStore();

  return (
    <button
      type="button"
      onClick={() => setShowFolderModal(true)}
      className={`group flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer p-6 transition-all duration-200 hover:border-[#f59e0b] hover:bg-[#fefce8] dark:hover:bg-[#2A2A2A] ${className}`}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 group-hover:bg-[#f59e0b]/10 group-hover:text-[#f59e0b] transition-colors">
        <Plus className="w-6 h-6" />
      </div>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-[#f59e0b] transition-colors">
        Create New Folder
      </span>
    </button>
  );
}
