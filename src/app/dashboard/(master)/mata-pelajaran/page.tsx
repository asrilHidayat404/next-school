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
import { FilterByClass } from "@/src/modules/subjects/features/FilterSubjectByClass";
import { SubjectActionButton } from "@/src/modules/subjects/features/SubjectActionButton";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    class_id?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const { currentPage, searchQuery } = parseSearchParams(searchParams);
  const classId = searchParams.class_id;
  const whereClause: Prisma.SubjectWhereInput = {
    ...(classId ? { class_id: classId } : {}),
    ...buildSearchWhere({}, searchQuery, ["subject_name"]),
  };

  //   const whereClause = buildSearchWhere({}, searchQuery, [
  //     "subject_name",
  //   ]);

  const { data: subject, pagination } = await paginate<
    typeof db.subject,
    Prisma.SubjectFindManyArgs,
    Prisma.SubjectGetPayload<{
      include: {
        teacher: {
          include: {
            user: true;
          };
        };
        class: {
          include: {
            school: true,
            teachers: {
              include: {
                user: true
              }
            }
          };
        };
      };
    }>[]
  >({
    model: db.subject,
    args: {
      where: whereClause,
      include: {
        class: {
          include: {
            school: true,
            teachers: {
              include: {
                user: true
              }
            }
          }
        },
        teacher: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
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
          <h1 className="text-1xl font-bold tracking-tight">
            Data Mata Pelajaran
          </h1>
          <small className="text-muted-foreground mt-1">
            Kelola Mata Pelajaran Sekolah terkait
          </small>
        </div>
      </div>

      {/* Card Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <SearchForm
            initialSearch={searchQuery}
            placeholder="Cari mata pelajaran berdasarkan nama..."
          />

          <FilterByClass />
          <ExportButton label="Export Materi" url="/api/" />

          <Link
            href="/dashboard/mata-pelajaran/tambah-mata-pelajaran"
            className="bg-primary text-accent px-2 py-1 flex items-center gap-2 rounded-md text-sm"
          >
            <PlusCircle size={15} />
            Tambah Materi
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {subject.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Tidak ada data Materi
            </div>
          ) : (
            <ScrollArea>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 py-2 text-left">No</TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Nama Materi
                    </TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Pengajar
                    </TableHead>
                    <TableHead className="px-4 py-2 text-left">Kelas</TableHead>
                    <TableHead className="px-4 py-2 text-left">
                      Madrasah
                    </TableHead>
                    <TableHead className="px-4 py-2 text-left sr-only">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subject.map((t, i) => (
                    <TableRow key={t.id_subject} className="hover:bg-muted/50">
                      <TableCell className="px-4 py-2">{(i += 1)}.</TableCell>
                      <TableCell className="px-4 py-2">
                        {t.subject_name}
                      </TableCell>

                      <TableCell className="px-4 py-2">
                        {t.teacher?.user.full_name || "belum di set"}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {t.class?.class_name || "belum di set"}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        {t.class?.school.school_name || "belum di set"}
                      </TableCell>
                      <TableCell className="px-4 py-2">
                        <SubjectActionButton
                          subject_id={t.id_subject}
                          subject_name={t.subject_name}
                          school_name={t.class?.school.school_name}
                          teacher_choices={teacherChoices ?? []}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </CardContent>
        {subject.length > 0 && (
          <Pagination
            modelName="Mata Pelajaran"
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
