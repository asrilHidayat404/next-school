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
import { Pagination } from "@/src/lib/Pagination";
import { ClassActionButton } from "@/src/modules/classes/features/ClassActionButton";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
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

  const whereClause = buildSearchWhere({}, searchQuery, ["class_name"]);

  const { data: schoolClass, pagination } = await paginate<
    typeof db.schoolClass,
    Prisma.SchoolClassFindManyArgs,
    Prisma.SchoolClassGetPayload<{ 
      include: { 
        students: true,
        school: true,
        teachers: {
          include: {
            user: true
          }
        }  
        homeroom_teacher: {
          include: {
            user: true
          }
        }
      } 
    }>[]
  >({
    model: db.schoolClass,
    args: {
      where: whereClause,
      include: {
        school: true,
        students: true,
        teachers: {
          include: {
            user: true
          }
        },
        homeroom_teacher: {
          include: {
            user: {
              select: {
                full_name: true,
              },
            },
          },
        },
      },
      orderBy: { class_name: "asc" },
    },
    page: currentPage,
    perPage: 10,
  });

  const teacherChoices = await db.teacher.findMany({
    include: {
      user: {
        select: {
          full_name: true,
        },
      },
      homeroom_of: {
        include: {
          school: {
            select: {
              school_name: true,
            },
          },
        },
      },
    },
  });

  

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-1xl font-bold tracking-tight">Data Kelas</h1>
          <small className="text-muted-foreground mt-1">
            Kelola kelas dan sekolah terkait
          </small>
        </div>
      </div>

      {/* Card Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <SearchForm initialSearch={searchQuery} />
          <ExportButton label="Export Semua Kelas" url="/api/class/export" />
          <Link
            href="/dashboard/kelas/tambah-kelas"
            className="bg-primary text-accent px-2 py-1 flex items-center gap-2 rounded-md text-sm"
          >
            <PlusCircle size={15} />
            Tambah Kelas
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {schoolClass.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Tidak ada data kelas
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2 text-left">No</TableHead>
                  <TableHead className="px-4 py-2 text-left">Kelas</TableHead>
                  <TableHead className="px-4 py-2 text-left">
                    Wali Kelas
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left">
                    Madrasah
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left">
                    Jumlah Siswa
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left sr-only"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolClass.map((c, i) => (
                  <TableRow key={c.id_class} className="hover:bg-muted/50">
                    <TableCell className="px-4 py-2">{(i += 1)}.</TableCell>
                    <TableCell className="px-4 py-2">{c.class_name}</TableCell>
                    <TableCell className="px-4 py-2">
                      {c.homeroom_teacher?.user.full_name ??
                        "Wali kelas belum di set"}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {c.school?.school_name || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {c.students?.length || 0}
                    </TableCell>
                    <TableCell>
                      <ClassActionButton
                        teacher_choices={teacherChoices ?? []}
                        class_id={c.id_class}
                        class_name={c.class_name}
                        school_name={c.school.school_name}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {schoolClass.length > 0 && (
          <Pagination
            modelName="School"
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            totalModels={pagination.total}
          />
        )}
      </Card>

      {/* Pagination info */}
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
