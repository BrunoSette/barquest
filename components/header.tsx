"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CircleIcon,
  Settings,
  BookCheck,
  LogOut,
  BadgeCheck,
  Video,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/app/(login)/actions";
import { DashboardIcon } from "@radix-ui/react-icons";
import { useUser } from "@/lib/auth";


export default function Header() {
  const { user } = useUser();

  console.log("HEADER", user);

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <CircleIcon className="h-6 w-6 text-orange-500" />
          <span className="ml-1 text-lg lg:text-xl font-semibold text-gray-900">
            BarQuest
          </span>
        </Link>
        <div className="flex items-center space-x-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer size-8">
                  <AvatarImage alt={user.name || ""} />
                  <AvatarFallback>
                    {user.email
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="p-0">
                <DropdownMenuItem className="w-full cursor-pointer m-1">
                  <Link href="/dashboard" className="flex w-full items-center">
                    <DashboardIcon className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="w-full cursor-pointer m-1">
                  <Link
                    href="/dashboard/newtest"
                    className="flex w-full items-center"
                  >
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    <span>Create Test</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="w-full cursor-pointer m-1">
                  <Link
                    href="/dashboard/videos"
                    className="flex w-full items-center"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    <span>User Guide</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="w-full cursor-pointer m-1">
                  <Link
                    href="/dashboard/subscription"
                    className="flex w-full items-center"
                  >
                    <BookCheck className="mr-2 h-4 w-4" />
                    <span>My Subscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="w-full cursor-pointer m-1">
                  <Link
                    href="/dashboard/general"
                    className="flex w-full items-center"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <form action={signOut} className="p-1">
                  <button type="submit" className="flex w-full">
                    <DropdownMenuItem className="w-full cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
