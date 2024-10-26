import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTeams } from "@/app/actions/users";

export default async function TeamsTable() {
  const teams = await getTeams();

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Stripe Users: {teams.length}</h2>
      <Table>
        <TableCaption>A list of all teams in the system.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Plan Name</TableHead>
            <TableHead>Subscription Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team: any) => (
            <TableRow key={team.id}>
              <TableCell>{(team.name || "").replace(/'s Team$/, "")}</TableCell>
              <TableCell>
                {new Date(team.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(team.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{team.plan_name}</TableCell>
              <TableCell>{team.subscription_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
