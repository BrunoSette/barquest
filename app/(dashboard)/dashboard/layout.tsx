"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/auth/";

import {
  Users,
  FileQuestion,
  Settings,
  Pencil,
  Video,
  FolderPlus,
  LayoutDashboard,
  BookCheck,
  BadgeCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState(false);

  const generalNavItems = [
    { href: "/dashboard/", icon: LayoutDashboard, label: "Dashboard" },
    {
      href: "/dashboard/newtest/",
      icon: BadgeCheck,
      label: "Create a New Test",
    },
    { href: "/dashboard/videos", icon: Video, label: "User Guide" },
    {
      href: "/dashboard/subscription",
      icon: BookCheck,
      label: "My Subscription",
    },
    { href: "/dashboard/general", icon: Settings, label: "Settings" },
  ];

  const adminNavItems = [
    {
      icon: FileQuestion,
      label: "Questions",
      subItems: [
        {
          href: "/dashboard/questions/create",
          icon: FolderPlus,
          label: "Create",
        },
        {
          href: "/dashboard/questions/edit",
          icon: Pencil,
          label: "Edit",
        },
      ],
    },
    { href: "/dashboard/users", icon: Users, label: "Users" },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100dvh-68px)] max-w-7xl mx-auto w-full">
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-white lg:bg-gray-50 border-r border-gray-200 lg:block ${
            isSidebarOpen ? "block" : "hidden"
          } lg:relative absolute inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="h-full overflow-y-auto p-4">
            {/* General Navigation Items */}
            {generalNavItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={`my-1 w-full justify-start ${
                    pathname === item.href ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}

            {/* Separator */}
            <div className="my-4 border-t border-gray-200"></div>

            {/* Admin Navigation Items */}
            {user?.role === "admin" && (
              <>
                <div className="font-medium text-gray-500 mb-2">
                  Admin Functions
                </div>
                {adminNavItems.map((item) => (
                  <div key={item.label}>
                    {item.subItems ? (
                      <>
                        <Button
                          variant="ghost"
                          className="my-1 w-full justify-start"
                          onClick={() => setIsQuestionsOpen(!isQuestionsOpen)}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                          {isQuestionsOpen ? (
                            <ChevronDown className="ml-auto h-4 w-4" />
                          ) : (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </Button>
                        {isQuestionsOpen &&
                          item.subItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              passHref
                            >
                              <Button
                                variant={
                                  pathname === subItem.href
                                    ? "secondary"
                                    : "ghost"
                                }
                                className={`my-1 w-full justify-start pl-8 ${
                                  pathname === subItem.href ? "bg-gray-100" : ""
                                }`}
                                onClick={() => setIsSidebarOpen(false)}
                              >
                                <subItem.icon className="mr-2 h-4 w-4" />
                                {subItem.label}
                              </Button>
                            </Link>
                          ))}
                      </>
                    ) : (
                      <Link key={item.href} href={item.href} passHref>
                        <Button
                          variant={
                            pathname === item.href ? "secondary" : "ghost"
                          }
                          className={`my-1 w-full justify-start ${
                            pathname === item.href ? "bg-gray-100" : ""
                          }`}
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </>
            )}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-0 lg:p-4">{children}</main>
      </div>
    </div>
  );
}
