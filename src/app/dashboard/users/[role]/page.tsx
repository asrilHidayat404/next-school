import db from "@/src/lib/db";
import { Card, CardContent, CardHeader } from "@/src/views/components/ui/card";
import DataTable from "@/src/views/components/User/DataTable";
import ExportUserButton from "@/src/views/components/User/ExportUserButton";
import { ImportUserButton } from "@/src/views/components/User/ImportUserForm";
import { CreateUserForm } from "@/src/views/components/User/CreateUserForm";
import { paginate } from "@/src/lib/paginate";
import SearchForm from "@/src/views/components/User/SearchUserForm";
import { buildSearchWhere } from "@/src/helpers/buildSearchWhere";
import { parseSearchParams } from "@/src/helpers/parseSearchParams";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import ExportButton from "@/src/views/components/User/ExportUserButton";

interface PageProps {
  params: { role: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { role } = params;

  const roles = await db.role.findUnique({
    where: { role_name: role },
  });

  if (!roles) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive mb-2">
                Role Not Found
              </h1>
              <p className="text-muted-foreground">
                Role "{role}" tidak ditemukan
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ gunakan helper biar konsisten dan aman
  const { currentPage, searchQuery } = parseSearchParams(searchParams);

  const whereClause = buildSearchWhere({ role_id: roles.id }, searchQuery, [
    "full_name",
    "email",
  ]);

  const { data: users, pagination } = await paginate<
      typeof db.user,
      Prisma.UserFindManyArgs,
      Prisma.UserGetPayload<{ 
        include: { 
          role: true,
        } 
      }>[]
    >({
    model: db.user,
    args: {
      where: whereClause,
      include: { role: true },
      orderBy: { full_name: "asc" },
    },
    page: currentPage,
    perPage: 10,
  });

  const roleChoices = await db.role.findMany({
    select:{
      id: true,
      role_name: true
    }
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight capitalize">
            User {role} Management
          </h1>
          <p className="text-muted-foreground">
            Manage {role.toLowerCase()} users and their permissions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SearchForm initialSearch={searchQuery} />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <ExportButton label="Export User" url="/api/" />
                <ImportUserButton />
                <CreateUserForm roleChoices={roleChoices} />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <DataTable
            users={users}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalUsers={pagination.total}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
