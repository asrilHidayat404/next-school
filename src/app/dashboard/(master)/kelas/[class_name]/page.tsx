import React from "react";
import { Card, CardContent, CardHeader } from "@/src/views/components/ui/card";
import SearchForm from "@/src/views/components/User/SearchUserForm";
import db from "@/src/lib/db";
import { paginate } from "@/src/lib/paginate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/views/components/ui/table";
import { buildSearchWhere } from "@/src/helpers/buildSearchWhere";
import { Pagination } from "@/src/lib/Pagination";
import { Prisma } from "@prisma/client";
import { ScrollArea, ScrollBar } from "@/src/views/components/ui/scroll-area";
import { StudentActionButton } from "@/src/modules/students/features/StudentActionButton";
import { Avatar, AvatarImage } from "@/src/views/components/ui/avatar";
import ExportButton from "@/src/views/components/User/ExportUserButton";
import ImportButton from "@/src/views/components/User/ImportButton";

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; class_id?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  // ✅ Harus di-await dulu
  const resolved = await searchParams;
  const classId = resolved.class_id;
  const currentPage = resolved.page ? Number(resolved.page) : 1;
  const searchQuery = resolved.search ?? "";

  // 🏫 Ambil data sekolah & kelas
  const school = await db.schoolClass.findUnique({
    where: { id_class: classId },
    include: {
      school: { select: { school_name: true } },
    },
  });

  // 🔍 Query pencarian (misalnya filter nama siswa)
  const whereClause = buildSearchWhere(
    {
      class: { id_class: classId },
    },
    searchQuery,
    ["user.full_name", "user.email"]
  );

  // 📦 Pagination data siswa
  const { data: student, pagination } = await paginate<
  typeof db.student,
  Prisma.StudentFindManyArgs,
  (Prisma.StudentGetPayload<{ include: { user: true } }>)[]
>({
    model: db.student,
    args: {
      where: whereClause,
      include: { user: true },
    },
    page: currentPage,
    perPage: 10,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Data Kelas {school?.class_name} – {school?.school.school_name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola kelas dan sekolah terkait
          </p>
        </div>
      </div>

      {/* Card Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          {/* ✅ Pastikan form pencarian kirim ke URL dengan class_id tetap ada */}
          <SearchForm
          placeholder="Cari siswa"
            initialSearch={searchQuery}
          />
          <ImportButton label="Import Siswa" />
          <ExportButton label={`Export`} url={`/api/students/class/${classId}`} />
        </CardHeader>

        <CardContent className="p-0">
          {student.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Tidak ada data siswa ditemukan
            </div>
          ) : (
            <ScrollArea>
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 py-2 text-left">No</TableHead>
                    <TableHead className="px-4 py-2 text-left">Nama</TableHead>
                    <TableHead className="px-4 py-2 text-left">NIS</TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Alamat
                    </TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Nomor Telepon
                    </TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Jenis Kelamin
                    </TableHead>
                    <TableHead className="px-4 py-2 text-left sr-only">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.map((t, i) => (
                    <TableRow key={t.id_student} className="hover:bg-muted/50">
                      <TableCell className="px-4 py-2">{(i += 1)}.</TableCell>
                      <TableCell className="px-4 py-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage
                              src="/default/defaultAvatar.png"
                              alt={t.user.full_name}
                              className="object-cover"
                            />
                          </Avatar>
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <p className="text-foreground truncate font-medium">
                              {t.user.full_name}
                            </p>
                            <p className="text-muted-foreground mt-[2px] truncate text-[8px]">
                              {t.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2">{t.nis}</TableCell>
                      <TableCell className="px-4 py-2">
                        {t.user.address || "belum di set"}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {t.user.phone_number || "belum di set"}
                      </TableCell>
                      <TableCell className="px-4 py-2 capitalize">
                        {t.user.gender || "belum di set"}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <StudentActionButton student_id={t.id_student} student_name={t.user.full_name} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          )}
        </CardContent>

        {student.length > 0 && (
          <Pagination
            modelName="Siswa"
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalModels={pagination.total}
          />
        )}
      </Card>
    </div>
  );
};

export default Page;
