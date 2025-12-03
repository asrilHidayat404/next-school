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
import { SchoolActionButton } from "@/src/modules/schools/features/SchoolActionButton";
import ExportButton from "@/src/views/components/User/ExportUserButton";
import { Prisma } from "@prisma/client";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const { currentPage, searchQuery } = parseSearchParams(searchParams);

  const whereClause = buildSearchWhere({}, searchQuery, ["school_name"]);

  const { data: school, pagination } = await paginate<
    typeof db.school,
    Prisma.SchoolFindManyArgs,
    Prisma.SchoolGetPayload<{ 
      include: { 
        classes: {
          include: {
            students: true
          }
        },
      } 
    }>[]
  >({
    model: db.school,
    args: {
      where: whereClause,
      include: { classes: { include: { students: true } } },
      orderBy: { school_name: "asc" },
    },
    page: currentPage,
    perPage: 10,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-1xl font-bold tracking-tight">Data Madrasah</h1>
          <small className="text-muted-foreground mt-1">
            Kelola Madrasah dan kelas terkait
          </small>
        </div>
      </div>

      {/* Card Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <SearchForm initialSearch={searchQuery} />
          <ExportButton label="Export Data" url="/api/school/export" />
          <Link
            href="/dashboard/madrasah/tambah-madrasah"
            className="bg-primary text-accent px-2 py-1 flex items-center gap-2 rounded-md text-sm"
          >
            <PlusCircle size={15} />
            Tambah Madrasah
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {school.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Tidak ada data kelas
            </div>
          ) : (
            <ScrollArea>
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2 text-left">No</TableHead>
                  <TableHead className="px-4 py-2 text-left">
                    Madrasah
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left">
                    Jumlah Kelas
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left">
                    Jumlah SIswa
                  </TableHead>
                  <TableHead className="text-left sr-only">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {school.map((s, i) => (
                  <TableRow key={s.school_name} className="hover:bg-muted/50">
                    <TableCell className="px-4 py-2">{(i += 1)}.</TableCell>
                    <TableCell className="px-4 py-2">{s.school_name}</TableCell>
                    <TableCell className="px-4 py-2">
                      {s.classes?.length || 0} {/* jumlah kelas */}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {s.classes?.reduce(
                        (total, cls) => total + (cls.students?.length || 0),
                        0
                      ) || 0}{" "}
                      {/* total siswa */}
                    </TableCell>
                    <TableCell>
                      <SchoolActionButton school_id={s.id_school} school_name={s.school_name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              <ScrollBar orientation="horizontal"/>
            </ScrollArea>
          )}
        </CardContent>
        {school.length > 0 && (
          <Pagination
            modelName="Sekolah"
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
