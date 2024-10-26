import { getUsers, getTeams, getContacts } from "@/app/actions/users";
import UsersAdmin from "@/components/users/users-admin";

export default async function AdminPage() {
  const [users, teams, contacts] = await Promise.all([
    getUsers(),
    getTeams(),
    getContacts(),
  ]);

  return (
    <UsersAdmin
      initialUsers={users}
      initialTeams={teams}
      initialContacts={contacts}
    />
  );
}
