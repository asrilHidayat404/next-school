"use client";

import { importExcelAction } from "@/src/action/import/ImportUserAction";
import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LoaderIcon, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "../ui/input";

export function ImportUserButton() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await importExcelAction(formData);
      if (res.success) {
        toast.success(`✅ Berhasil import ${res.count} data`);
      } else {
        toast.error(`❌ Gagal: ${res.message}`);
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="file" name="file" accept=".xlsx,.xls" required />

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ?<LoaderIcon className="animate-spin h-5 w-5" /> : null}
              {isPending ? "Importing..." : "Import"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
