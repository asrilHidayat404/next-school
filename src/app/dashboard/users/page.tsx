import { Card, CardContent, CardHeader } from "@/src/views/components/ui/card";
import { Skeleton } from "@/src/views/components/ui/skeleton";
import { CreateUserForm } from "@/src/views/components/User/CreateUserForm";
import DataTable from "@/src/views/components/User/DataTable";
import ExportUserButton from "@/src/views/components/User/ExportUserButton";
import { ImportUserButton } from "@/src/views/components/User/ImportUserForm";
import SearchForm from "@/src/views/components/User/SearchUserForm";
import { buildSearchWhere } from "@/src/helpers/buildSearchWhere";
import { parseSearchParams } from "@/src/helpers/parseSearchParams";
import db from "@/src/lib/db";
import { paginate } from "@/src/lib/paginate";
import { UserWithRole } from "@/src/types";
import { Suspense } from "react";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const { currentPage, searchQuery } = parseSearchParams(searchParams);
  
  

  const whereClause = buildSearchWhere(
    {}, // ✅ lebih aman daripada null
    searchQuery,
    ["full_name", "email"]
  );

  const { data: users, pagination } = await paginate({
    model: db.user,
    args: {
      where: whereClause,
      include: { role: { select: { role_name: true } } }, // Ensure role is included
      orderBy: { role: { role_name: "asc" } },
    },
    page: currentPage,
    perPage: 10,
  });


  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage system users and permissions
        </p>
      </div>

      <Card className="bg-accent">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchForm initialSearch={searchQuery} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <ExportUserButton />
                <ImportUserButton />
                <CreateUserForm />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Suspense fallback={<TableLoading />}>
            <DataTable
              users={users}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalUsers={pagination.total}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

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
