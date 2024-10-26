import { Suspense } from "react";
import ResendUsers from "@/components/users/resendUsers";
import UsersTable from "@/components/users/users-table";
import TeamsTable from "@/components/users/teams-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TableSkeleton = () => (
  <div className="space-y-4">
    <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
  </div>
);

export default function UsersAdmin() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Database</TabsTrigger>
          <TabsTrigger value="teams">Stripe</TabsTrigger>
          <TabsTrigger value="resend">Resend</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Suspense fallback={<TableSkeleton />}>
            <UsersTable />
          </Suspense>
        </TabsContent>

        <TabsContent value="teams">
          <Suspense fallback={<TableSkeleton />}>
            <TeamsTable />
          </Suspense>
        </TabsContent>

        <TabsContent value="resend">
          <Suspense fallback={<TableSkeleton />}>
            <ResendUsers />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
