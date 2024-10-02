import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { CreateQuestionsComponent } from "@/components/create-questions";
import Head from "next/head";

export const metadata = {
  title: "Create Questions - BarQuest",
  description: "Your Ultimate Prep Tool for the Ontario Bar Exam",
};

export default async function SubscriptionPage() {
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
      <CreateQuestionsComponent />;
    </div>
  );
}
