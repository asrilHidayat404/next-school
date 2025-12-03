"use client";

import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchFormProps {
  initialSearch?: string;
  placeholder?: string;
  searchKey?: string; // default "search" (kalau mau pake searchKey lain, misalnya "query")
}

const SearchForm = ({
  initialSearch = "",
  placeholder = "Cari data...",
  searchKey = "search",
}: SearchFormProps) => {
  const [query, setQuery] = useState(initialSearch);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync dengan initialSearch dari parent
  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  // Debounced search
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (term) {
      params.set(searchKey, term);
      params.delete("page"); // reset ke page 1 saat ganti query
    } else {
      params.delete(searchKey);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch.flush(); // langsung eksekusi tanpa delay
    }
  };

  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-9 h-8 text-sm"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchForm;
