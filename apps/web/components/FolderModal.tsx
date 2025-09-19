import { Loader2 } from "lucide-react";
import { useFolderStore, useUiStore } from "@repo/store";
import { MouseEventHandler, useEffect, useState } from "react";
import { IconsButton } from "./IconsButton";
import { ColorsButton } from "./ColorsButton";
import { toast } from "sonner";
import { CreateFolderPayload } from "@repo/types";

export function FolderModal({
  parentFolder,
}: {
  parentFolder?: { id: string; name: string };
}) {
  const { setShowFolderModal, showFolderModal, loading } = useUiStore();
  const { addFolder, editingFolder, updateFolder, clearEditingFolder } =
    useFolderStore();

  const [folderName, setFolderName] = useState("");
  const [color, setColor] = useState("");
  const [icon, setIcon] = useState("Folder");

  useEffect(() => {
    if (editingFolder) {
      setFolderName(editingFolder.name);
      setColor(editingFolder.color || "");
      setIcon(editingFolder.icon || "Folder");
    } else {
      setFolderName("");
      setColor("");
      setIcon("Folder");
    }
  }, [editingFolder, showFolderModal, clearEditingFolder]);

  const resetForm = () => {
    setFolderName("");
    setColor("");
    setIcon("Folder");
    clearEditingFolder();
  };

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!folderName.trim()) {
      toast.error("Folder name is required.");
      return;
    }
    const payload: CreateFolderPayload = {
      name: folderName,
      parentId: parentFolder?.id || null,
      color: color || undefined,
      icon: icon || undefined,
    };

    const action = editingFolder
      ? updateFolder({ ...payload, id: editingFolder.id })
      : addFolder(payload);

    toast.promise(action, {
      loading: editingFolder ? "Updating folder..." : "Creating folder...",
      success: () => {
        setShowFolderModal(false);
        resetForm();
        return editingFolder
          ? "Folder updated successfully"
          : "Folder created successfully";
      },
      error: (error) => error.message || "Failed to process folder",
    });
  };

  return (
    <>
      {showFolderModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={() => {
            setShowFolderModal(false);
            clearEditingFolder();
          }}
        >
          <div
            className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {editingFolder ? "Edit Folder" : "Create Folder"}
            </h2>

            {/* Folder name */}
            <label
              htmlFor="folderName"
              className="block mb-1 text-sm text-gray-700 dark:text-gray-300 font-medium"
            >
              Folder Name
            </label>
            <input
              id="folderName"
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  handleSubmit(
                    e as unknown as React.MouseEvent<HTMLButtonElement>
                  );
              }}
              placeholder="Enter folder name"
              className="w-full h-10 px-3 mb-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent transition"
            />

            {/* Icon picker */}
            <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
              Icon (optional)
            </label>
            <IconsButton onChange={setIcon} selectedIcon={icon} />

            {/* Color picker */}
            <div className="mt-4">
              <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                Color (optional)
              </label>
              <ColorsButton onChange={setColor} selectedColor={color} />
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowFolderModal(false);
                  clearEditingFolder();
                }}
                className="cursor-pointer px-5 py-2 rounded-md bg-gray-200 text-gray-900 border border-gray-300 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className={`cursor-pointer px-5 py-2 rounded-md bg-[#f59e0b] text-white border border-[#d97706] hover:bg-[#d97706] transition-colors ${
                  loading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    {editingFolder ? "Saving..." : "Creating..."}
                  </span>
                ) : editingFolder ? (
                  "Save Changes"
                ) : (
                  "Create Folder"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
