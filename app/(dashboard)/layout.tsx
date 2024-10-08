"use client";

import Link from "next/link";
import { useState } from "react";
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
import { useUser } from "@/lib/auth";
import { signOut } from "@/app/(login)/actions";
import { useRouter } from "next/navigation";
import { DashboardIcon } from "@radix-ui/react-icons";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    setUser(null);
    await signOut();
    router.push("/");
  }

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

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
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
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
                <DropdownMenuItem
                  className="w-full cursor-pointer m-1"
                  onSelect={handleMenuItemClick}
                >
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center"
                    onClick={handleMenuItemClick}
                  >
                    <DashboardIcon className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full cursor-pointer m-1"
                  onSelect={handleMenuItemClick}
                >
                  <Link
                    href="/dashboard/newtest"
                    className="flex w-full items-center"
                    onClick={handleMenuItemClick}
                  >
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    <span>Create Test</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full cursor-pointer m-1"
                  onSelect={handleMenuItemClick}
                >
                  <Link
                    href="/dashboard/videos"
                    className="flex w-full items-center"
                    onClick={handleMenuItemClick}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    <span>User Guide</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full cursor-pointer m-1"
                  onSelect={handleMenuItemClick}
                >
                  <Link
                    href="/dashboard/subscription"
                    className="flex w-full items-center"
                    onClick={handleMenuItemClick}
                  >
                    <BookCheck className="mr-2 h-4 w-4" />
                    <span>My Subscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full cursor-pointer m-1"
                  onSelect={handleMenuItemClick}
                >
                  <Link
                    href="/dashboard/general"
                    className="flex w-full items-center"
                    onClick={handleMenuItemClick}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <form action={handleSignOut} className="p-1">
                  <button
                    type="submit"
                    className="flex w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      handleMenuItemClick();
                      handleSignOut();
                    }}
                  >
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
