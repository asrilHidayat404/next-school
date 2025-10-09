import { auth } from "@/src/lib/auth";
import db from "@/src/lib/db";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/views/components/ui/card";
import { Button } from "@/src/views/components/ui/button";
import { Badge } from "@/src/views/components/ui/badge";
import { Input } from "@/src/views/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/views/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/views/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/views/components/ui/dialog";
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  Download,
  Calendar,
} from "lucide-react";
import { parseSearchParams } from "@/src/helpers/parseSearchParams";
import { buildSearchWhere } from "@/src/helpers/buildSearchWhere";
import { paginate } from "@/src/lib/paginate";
import { Pagination } from "@/src/lib/Pagination";
import SearchForm from "@/src/views/components/User/SearchUserForm";
import { ActivityLogWithUser } from "@/src/types";
import { ScrollArea, ScrollBar } from "@/src/views/components/ui/scroll-area";
import TypeFilter from "@/src/views/components/ActivityLog/SelectLogType";

// Komponen Dialog Detail yang lebih compact
function DetailDialog({ log }: { log: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1">
          <Eye className="h-3 w-3" />
          <span className="sr-only sm:not-sr-only">Detail</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Detail Aktivitas</DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang aktivitas yang dilakukan
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">User</label>
              <p className="text-sm text-muted-foreground mt-0.5">
                {log.user?.full_name || log.user?.email || "System"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Waktu</label>
              <p className="text-sm text-muted-foreground mt-0.5">
                {new Date(log.timestamp).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Event</label>
              <div className="mt-0.5">
                <Badge variant="outline" className="text-xs">
                  {log.event}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Tipe</label>
              <div className="mt-0.5">
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    log.type === "Update"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : log.type === "Create"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : log.type === "Delete"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {log.type}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Effected Data</label>
            <div className="mt-0.5 p-2 bg-muted rounded text-xs">
              {log.effected}
            </div>
          </div>

          {log.details && (
            <div>
              <label className="text-sm font-medium">Detail Perubahan</label>
              <div className="mt-0.5 p-2 bg-muted rounded text-xs">
                <ScrollArea className="h-32">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            </div>
          )}

          {(log.ipAddress || log.userAgent) && (
            <div className="grid grid-cols-2 gap-3">
              {log.ipAddress && (
                <div>
                  <label className="text-sm font-medium">IP Address</label>
                  <p className="text-sm text-muted-foreground font-mono mt-0.5 truncate" >
                    {log.ipAddress}
                  </p>
                </div>
              )}
              {log.userAgent && (
                <div>
                  <label className="text-sm font-medium">User Agent</label>
                  <p className="text-sm text-muted-foreground mt-0.5 truncate" title={log.userAgent}>
                    {log.userAgent}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    type: string;
  };
}

const LogActivityPage = async ({ searchParams }: PageProps) => {
  const { currentPage, searchQuery } = parseSearchParams(searchParams);

  const typeFilter =
    searchParams.type && searchParams.type !== "all"
      ? { type: searchParams.type }
      : {};

  // const whereClause = buildSearchWhere({}, searchQuery, ["type"]);
  const { data, pagination } = await paginate({
    model: db.activityLog,
    args: {
      where: {
        ...typeFilter,
        OR: [
          { user: { full_name: { contains: searchQuery } } },
          { user: { email: { contains: searchQuery } } },
          {
            type: {
              contains: "LOGIN",
            },
          },
        ],
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    },
    page: currentPage,
    perPage: 10,
  });

  const logs = data as ActivityLogWithUser[];

  return (
    <main className="bg-background min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header Section - Compact */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold">Activity Logs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              NEXT JS - Monitor aktivitas sistem
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Logs Table - Compact */}
        <Card className="border">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 min-w-0">
                <SearchForm initialSearch={searchQuery} />
              </div>

              <TypeFilter />

              <Select name="limit" defaultValue="10">
                <SelectTrigger className="w-full sm:w-28 h-9">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>

              <Button
                type="reset"
                variant="outline"
                size="sm"
                className="h-9 whitespace-nowrap"
              >
                <Filter className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 py-2 text-center">No</TableHead>
                    <TableHead className="w-[200px] py-2">User</TableHead>
                    <TableHead className="w-[120px] py-2">Event</TableHead>
                    <TableHead className="w-[220px] py-2">Effected</TableHead>
                    <TableHead className="w-[150px] py-2">Time</TableHead>
                    <TableHead className="w-[80px] py-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length ? (
                    logs.map((log, index) => (
                      <TableRow key={log.id} className="hover:bg-muted/30">
                        <TableCell className="py-2 text-xs text-center font-medium">
                          {/* {(currentPage - 1) * 10 + index + 1}. */}
                          {index + 1}.
                        </TableCell>
                        <TableCell className="py-2">
                          <div>
                            <div className="text-sm font-medium truncate">
                              {log.user?.full_name ||
                                log.user?.email ||
                                "System"}
                            </div>
                            {log.user?.role && (
                              <div className="text-xs text-muted-foreground capitalize truncate">
                                {log.user.role.role_name.toLowerCase()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          <Badge
                            variant="outline"
                            className="text-xs px-1.5 py-0"
                          >
                            {log.event}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2">
                          <div
                            className="text-xs text-muted-foreground truncate"
                            title={log.effected}
                          >
                            {log.effected}
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {new Intl.DateTimeFormat("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }).format(new Date(log.createdAt))}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <DetailDialog log={log} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                   <TableRow>
                     <TableCell colSpan={6}>
                      <div className="flex  flex-col items-center justify-center gap-3 py-6 text-center">
                        <div className="bg-muted rounded-full p-3 flex items-center justify-center">
                          <Filter className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">
                            Tidak ada aktivitas
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Tidak ditemukan aktivitas yang sesuai dengan filter
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Reset Filter
                        </Button>
                      </div>
                    </TableCell>
                   </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {logs.length > 0 && (
                <div className="flex justify-end">
                  <Pagination
                    modelName="Log Activity"
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    totalModels={pagination.total}
                  />
                </div>
              )}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Empty State - Compact */}
        {/* {logs.length === 0 && } */}
      </div>
    </main>
  );
};

export default LogActivityPage;
