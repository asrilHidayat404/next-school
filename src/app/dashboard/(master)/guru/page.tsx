import { Card, CardContent, CardHeader } from "@/src/views/components/ui/card";
import { Skeleton } from "@/src/views/components/ui/skeleton";
import { ImportUserButton } from "@/src/views/components/User/ImportUserForm";
import SearchForm from "@/src/views/components/User/SearchUserForm";
import { buildSearchWhere } from "@/src/helpers/buildSearchWhere";
import { parseSearchParams } from "@/src/helpers/parseSearchParams";
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
import Link from "next/link";
import { Pagination } from "@/src/lib/Pagination";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/src/views/components/ui/scroll-area";
import ExportButton from "@/src/views/components/User/ExportUserButton";
import { Prisma } from "@prisma/client";
import { Avatar, AvatarImage } from "@/src/views/components/ui/avatar";
import { TeacherActionButton } from "@/src/modules/teachers/features/TeacherActionButton";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const { currentPage, searchQuery } = parseSearchParams(searchParams);

  const whereClause = buildSearchWhere({}, searchQuery, [
    "nip",
    "user.full_name",
    "user.email",
  ]);

  const { data: teacher, pagination } = await paginate<
    typeof db.teacher,
    Prisma.TeacherFindManyArgs,
    Prisma.TeacherGetPayload<{
      include: {
        user: true;
      };
    }>[]
  >({
    model: db.teacher,
    args: {
      where: whereClause,
      include: { user: true },
      orderBy: { createdAt: "desc" },
    },
    page: currentPage,
    perPage: 10,
  });

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

          <ExportButton label="Export Guru" url="/api/" />

          <Link
            href="/dashboard/guru/tambah-guru"
            className="bg-primary text-accent px-2 py-1 flex items-center gap-2 rounded-md text-sm"
          >
            <PlusCircle size={15} />
            Tambah Guru
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {teacher.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Tidak ada data Guru
            </div>
          ) : (
            <ScrollArea>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 py-2 text-left">No</TableHead>
                    <TableHead className="px-4 py-2 text-left">Nama</TableHead>
                    <TableHead className="px-4 py-2 text-left">NIP</TableHead>
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
                  {teacher.map((t, i) => (
                    <TableRow key={t.id_teacher} className="hover:bg-muted/50">
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
                      <TableCell className="px-4 py-2">{t.nip}</TableCell>

                      <TableCell className="px-4 py-2">
                        {t.user.address || "belum di set"}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {t.user.phone_number || "belum di set"}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {t.user.gender || "belum di set"}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <TeacherActionButton teacher_id={t.id_teacher} teacher_name={t.user.full_name} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </CardContent>
        {teacher.length > 0 && (
          <Pagination
            modelName="Guru"
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            totalModels={pagination.total}
          />
        )}
      </Card>
    </div>
  );
};

// Skeleton loading (optional)
const TableLoading = () => (
  <div className="space-y-2 p-4">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
);

export default Page;
