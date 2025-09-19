import { useSearchStore, useUiStore } from "@repo/store";
import { Search, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchResults } from "../SearchResults";

export function SearchBar({
  placeholder,
  className,
  scope = "dashboard",
  folderId,
}: {
  placeholder: string;
  className?: string;
  scope?: "dashboard" | "folder";
  folderId?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { fetchSearchResults, isLoading, setLoading, clearSearchResults } =
    useSearchStore();
  const { setError } = useUiStore();

  useEffect(() => {
    if (!query.trim()) {
      setOpen(false);
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetchSearchResults({
        q: query,
        scope,
        folderId: scope === "folder" ? folderId : undefined,
      });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, scope, folderId, fetchSearchResults]);

  const clearSearch = () => {
    setQuery("");
    setOpen(false);
    clearSearchResults();
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setOpen(false);
      return;
    }
    setOpen(true);
    setLoading(true);
  };

  return (
    <div
      className={`relative rounded-lg border border-gray-300 dark:border-[#444] bg-white dark:bg-[#2A2A2A] shadow-sm dark:shadow-md ${className}`}
    >
      {/* Search icon */}
      <Search className="absolute top-2.5 left-3 text-gray-500 dark:text-gray-400" />

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="w-full pl-12 pr-10 py-2 rounded-lg bg-transparent text-[#1F1F1F] dark:text-[#FFFFFFCF] placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-colors"
      />

      {/* Loader or Clear button */}
      {isLoading ? (
        <Loader2 className="absolute top-2.5 right-3 animate-spin text-gray-500 dark:text-gray-400" />
      ) : query && open ? (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute top-2.5 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X />
        </button>
      ) : null}

      {/* Results dropdown */}
      {open && <SearchResults />}
    </div>
  );
}
