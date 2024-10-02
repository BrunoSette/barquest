import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import UsersTableAndGraphs from "@/components/users-table-and-graphs";
import Head from "next/head";

export const metadata = {
  title: "Users Admin - BarQuest",
  description: "Your Ultimate Prep Tool for the Ontario Bar Exam",
};

export default async function TestePage() {
  const user = await getUser();

  if (!user || user.role !== "admin") {
    redirect("/sign-in");
  }

  return (
    <div>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <UsersTableAndGraphs />
    </div>
  );
}
