import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getContacts } from "@/app/actions/users";

export default async function ResendUsers() {
  const contacts = await getContacts();

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Email Contacts</h2>
      <Table>
        <TableCaption>A list of all email contacts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Unsubscribed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact: any) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.id}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>
                {new Date(contact.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{contact.first_name || "-"}</TableCell>
              <TableCell>{contact.last_name || "-"}</TableCell>
              <TableCell>{contact.unsubscribed ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
