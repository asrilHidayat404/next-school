"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/views/components/ui/select";
import { SchoolClass } from "@prisma/client";

export function FilterList({classes}: {classes: SchoolClass[]}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedClassId = searchParams.get("class_id");


  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("class_id");
    } else {
      params.set("class_id", value);
    }
    router.push(`?${params.toString()}`);
  };


  return (
    <Select onValueChange={handleChange} defaultValue={selectedClassId ?? "all"}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter Kelas" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Kelas</SelectItem>
        {classes.map((cls) => (
          <SelectItem key={cls.id_class} value={cls.id_class}>
            {cls.class_name} ({cls.school.school_name})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
