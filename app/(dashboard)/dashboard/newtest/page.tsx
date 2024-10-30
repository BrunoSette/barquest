import { redirect } from "next/navigation";
import { Settings } from "./settings";
import { getProductsForUser, getUser } from "@/lib/db/queries";
import { UserProduct } from "@/lib/db/schema";

export default async function NewTestPage() {
  const user = await getUser();

  if (!user) {
    console.log("No user found, redirecting to login");
    redirect("/sign-in");
  }

  // console.log("User found:", user);

  // let teamData;
  let userProducts: UserProduct[]  = [];
  try {
    // teamData = await getTeamForUser(user.id);
    userProducts = await getProductsForUser(user.id);
    // console.log("User Products data fetched successfully:", userProducts);
    // console.log("Team data fetched successfully:", teamData);
  } catch (error) {
    console.error("Error fetching team data:", error);
    // Instead of redirecting, we'll pass null to the Settings component
    // teamData = null;
  }

  return (
    <div>
      <Settings userProducts={userProducts} />
    </div>
  );
}


