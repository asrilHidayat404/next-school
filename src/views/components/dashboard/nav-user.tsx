"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/views/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/views/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/src/views/components/ui/sidebar"
import Link from "next/link"
import { Skeleton } from "../ui/skeleton"
import { signOut, useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { data } from "@/src/lib/routes"

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter()
  const handleLogout = async () => {
    try {
      const res = await signOut({
        redirect: false, // ⬅️ biar kita yang handle redirect
      });

      if (res?.url) {
        toast.success("Signed Out!");
        router.push("/sign-in");// ⬅️ redirect manual
      } else {
        toast.error("Something went wrong during sign out.");
      }
    } catch (error) {
      toast.error("Sign out failed.");
    }
  };

  const { data: session } = useSession()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={`/storage/${session?.user.avatar}`} alt={"-"} />
                <AvatarFallback className="rounded-lg">
                  <img src="/illustrations/login-bg.png" alt="" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {!session?.user ? (
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <>
                    <span className="truncate font-medium">{session?.user.fullName ?? "Username"}</span>
                    <span className="truncate text-xs">{session?.user.email ?? "-"}</span>
                  </>
                )}
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={`/storage/${session?.user.avatar}`} alt={''} />
                  <AvatarFallback className="rounded-lg">
                    <img src="/illustrations/login-bg.png" alt="" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {!session?.user ? (
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : (
                    <>
                      <span className="truncate font-medium">{session?.user.fullName ?? "Username"}</span>
                      <span className="truncate text-xs">{session?.user.email ?? ""}</span>
                    </>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                <Link href="/dashboard/account-settings">
                  Account Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
