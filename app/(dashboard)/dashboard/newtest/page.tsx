import { redirect } from "next/navigation";
import { Settings } from "./settings";
import { getTeamForUser, getUser } from "@/lib/db/queries";

export default async function NewTestPage() {
  const user = await getUser();

  if (!user) {
    console.log('No user found, redirecting to login');
    redirect("/login");
  }

  console.log('User found:', user);

  let teamData;
  try {
    teamData = await getTeamForUser(user.id);
    console.log('Team data fetched successfully:', teamData);
  } catch (error) {
    console.error('Error fetching team data:', error);
    // Instead of redirecting, we'll pass null to the Settings component
    teamData = null;
  }

  return (
    <div>
      <Settings teamData={teamData} />
    </div>
  );
}
