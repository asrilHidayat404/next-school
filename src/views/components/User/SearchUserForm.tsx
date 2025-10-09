"use client";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchUserFormProps {
  initialSearch?: string;
}

const SearchForm = ({ initialSearch = "" }: SearchUserFormProps) => {
  const [query, setQuery] = useState(initialSearch);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync dengan initialSearch prop
  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  // Debounced search untuk optimasi performa
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (term) {
      params.set('search', term);
      params.delete('page'); // Reset ke halaman 1 saat search baru
    } else {
      params.delete('search');
    }
    
    router.push(`?${params.toString()}`, { scroll: false });
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch.flush(); // Immediately execute the search
    }
  };

  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        placeholder="Search users by name or email..."
        className="pl-9 h-9 text-sm"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchForm;