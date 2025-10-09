"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/src/views/components/ui/select";

export default function TypeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ambil type sekarang dari URL, default "all"
  const currentType = searchParams.get("type") || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("type"); // jangan simpan kalau "all"
    } else {
      params.set("type", value);
    }
    params.set("page", "1"); // reset ke page 1 kalau filter berubah
    router.push(`?${params.toString()}`);
  };

  return (
    <Select name="type" defaultValue={currentType} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-32 h-9">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        <SelectItem value="Create">Create</SelectItem>
        <SelectItem value="Update">Update</SelectItem>
        <SelectItem value="Delete">Delete</SelectItem>
        <SelectItem value="Login">Login</SelectItem>
        <SelectItem value="Logout">Logout</SelectItem>
        <SelectItem value="Reset Password">Reset</SelectItem>
      </SelectContent>
    </Select>
  );
}
