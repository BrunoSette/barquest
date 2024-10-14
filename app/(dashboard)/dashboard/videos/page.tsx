import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { InstructionsAndTipsComponent } from "@/components/instructions-and-tips";
import Head from "next/head";

export const metadata = {
  title: "Videos - BarQuest",
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
      <InstructionsAndTipsComponent />;
    </div>
  );
}
