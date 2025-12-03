import { Card, CardContent, CardHeader } from "@/src/views/components/ui/card";
import { Skeleton } from "@/src/views/components/ui/skeleton";
import SearchForm from "@/src/views/components/User/SearchUserForm";
import { parseSearchParams } from "@/src/helpers/parseSearchParams";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/views/components/ui/table";
import Link from "next/link";
import { Pagination } from "@/src/lib/Pagination";
import { PlusCircle } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/src/views/components/ui/scroll-area";
import ExportButton from "@/src/views/components/User/ExportUserButton";
import { Avatar, AvatarImage } from "@/src/views/components/ui/avatar";
import { StudentActionButton } from "@/src/modules/students/features/StudentActionButton";
import { studentService } from "@/src/modules/students/services/StudentServices";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const { currentPage, searchQuery } = parseSearchParams(searchParams);
  const { student, pagination } = await studentService.getAllStudents(searchQuery, currentPage)
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-1xl font-bold tracking-tight">Data Guru</h1>
          <small className="text-muted-foreground mt-1">
            Kelola Guru dan sekolah terkait
          </small>
        </div>
      </div>

      {/* Card Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <SearchForm
            initialSearch={searchQuery}
            placeholder="Cari guru berdasarkan nama, email, atau NIP..."
          />

          <ExportButton label="Export Siswa" url="/api/students/export" />

          <Link
            href="/dashboard/siswa/tambah-siswa"
            className="bg-primary text-accent px-2 py-1 flex items-center gap-2 rounded-md text-sm"
          >
            <PlusCircle size={15} />
            Tambah Siswa
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {student.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Tidak ada data Siswa
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
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </CardContent>
        {student.length > 0 && (
          <Pagination
            modelName="Siswa"
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            totalModels={pagination.total}
          />
        )}
      </Card>
    </div>
  );
};

export default Page;
