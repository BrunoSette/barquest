import { redirect } from "next/navigation";
import { getUser } from "@/lib/db/queries";
import { InstructionsAndTipsComponent } from "@/components/instructions-and-tips";

export default async function TestePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <InstructionsAndTipsComponent />;
}
