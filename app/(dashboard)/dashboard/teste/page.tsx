import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import MultipleChoiceTest from "@/components/multiple-choice-test";
import Head from "next/head";

export const metadata = {
  title: "Create New Test - BarQuest",
  description: "Your Ultimate Prep Tool for the Ontario Bar Exam",
};

export default async function TestePage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <MultipleChoiceTest userId={user.id as number} />
    </div>
  );
}
