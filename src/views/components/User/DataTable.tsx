"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/views/components/ui/table";
import { Badge } from "@/src/views/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/views/components/ui/avatar";
import {
  MoreHorizontal,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";

import UserButtonAction from "@/src/views/components/User/UserButtonAction";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { UserWithRole } from "@/src/types";
import { Pagination } from "@/src/lib/Pagination";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

const getInitials = (name: string | null) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

interface DataTableProps {
  users: UserWithRole[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

const DataTable = React.memo(
  ({ users, currentPage, totalPages, totalUsers }: DataTableProps) => {
    const headers = [
      { key: "no", label: "No", className: "w-8" },
      { key: "full_name", label: "Full Name", className: "w-32" },
      { key: "role", label: "Role", className: "w-20" },
      { key: "gender", label: "Gender", className: "w-20" },
      { key: "address", label: "Address", className: "w-40" },
      { key: "created", label: "Registered At", className: "w-24" },
      { key: "actions", label: "", className: "w-12" },
    ];

    return (
      <ScrollArea className="w-full">
        <Table className="">
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead
                  key={header.key}
                  className={`font-medium text-muted-foreground px-2 py-2 ${header.className}`}
                >
                  {header.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                {/* No */}
                <TableCell className="px-2 py-1 text-muted-foreground text-center">
                  {index + 1}.
                </TableCell>

                {/* User Info */}
                <TableCell className="px-2 py-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={user.avatar ? `/storage/${user.avatar}` : ""}
                      />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium line-clamp-1 truncate">
                        {user.full_name || "Unnamed User"}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Mail className="h-2.5 w-2.5 text-muted-foreground" />
                        <span className="text-muted-foreground truncate line-clamp-1">
                          {user.email || "No email"}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell className="px-2 py-1">
                  <Badge
                    variant={
                      user.role?.role_name === "admin"
                        ? "destructive"
                        : "secondary"
                    }
                    className="text-xs px-2 py-0 h-5 min-w-[60px] justify-center"
                  >
                    {user.role?.role_name || "No Role"}
                  </Badge>
                </TableCell>

                {/* Gender */}
                <TableCell className="px-2 py-1">
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0 h-5 min-w-[60px] justify-center"
                  >
                    Laki-laki
                  </Badge>
                </TableCell>

                {/* Address */}
                <TableCell className="px-2 py-1">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="max-w-[120px] cursor-pointer">
                        <span className="line-clamp-2 leading-tight text-wrap text-xs text-muted-foreground">
                          {user.full_name || "No address provided"}
                        </span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 max-w-[90vw]">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Address</h4>
                        <p className="text-sm text-muted-foreground">
                          {user.full_name || "No address provided"}
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                {/* Created At */}
                <TableCell className="px-2 py-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(user.createdAt))}
                    </span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="px-2 py-1">
                  <UserButtonAction selectedUser={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <UserPlus className="w-12 h-12 text-muted-foreground mb-4" />
            <div className="text-muted-foreground text-sm">No users found</div>
          </div>
        )}

        {users.length > 0 && (
          <Pagination
            modelName="User"
            currentPage={currentPage}
            totalPages={totalPages}
            totalModels={totalUsers}
          />
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }
);

export default React.memo(DataTable);
