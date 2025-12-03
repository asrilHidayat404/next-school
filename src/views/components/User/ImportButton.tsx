"use client";

import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { importStudentsAction } from "@/src/modules/students/action/ImportStudentAction";

const ImportButton = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState()
  const [previewData, setPreviewData] = useState()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file type
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      toast.error("Hanya file Excel (.xlsx, .xls) atau CSV yang didukung");
      return;
    }

    // Validasi ukuran file (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File terlalu besar. Maksimal 10MB");
      return;
    }

    setFileName(file.name);

    // Proses upload (contoh dummy)
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await importStudentsAction(formData)
      if (!res.success) {
        throw new Error("Gagal mengimpor data siswa");
      }
      console.log(res.data);
      setPreviewData(res.data)
      

      toast.success("Berhasil mengimpor data siswa!");
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
      e.target.value = ""; // reset input supaya bisa upload file yang sama lagi
    }
  };
  console.log(previewData);
  
  return (
    <div className="flex items-center gap-2">
      {/* Input disembunyikan */}
      <Input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        name="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Tombol Import */}
      <Button
        variant="default"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => fileRef.current?.click()} // klik input file
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" />
            Mengimpor...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Import
          </>
        )}
      </Button>

      {/* Nama file (jika sudah dipilih) */}
      {fileName && <span className="text-sm text-gray-600">{fileName}</span>}

    </div>
  );
};

export default ImportButton;
