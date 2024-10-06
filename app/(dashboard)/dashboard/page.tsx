import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { DashboardComponent } from "@/components/dashboard";
import Head from "next/head";

export const metadata = {
  title: "Dashboard - BarQuest",
  description: "Your Ultimate Prep Tool for the Ontario Bar Exam",
};

export default async function SubscriptionPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <DashboardComponent userId={user.id} />
    </div>
  );
}
