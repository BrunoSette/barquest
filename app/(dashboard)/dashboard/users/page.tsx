import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import UsersTableAndGraphs from "@/components/users-table-and-graphs";

export default async function TestePage() {
  const user = await getUser();

  if (!user || user.role !== "admin") {
    redirect("/sign-in");
  }

  return <UsersTableAndGraphs />;
}
