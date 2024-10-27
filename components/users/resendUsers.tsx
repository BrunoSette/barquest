import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getContacts } from "@/app/actions/users";
import dynamic from "next/dynamic";

// Dynamically import the chart component with ssr: false
const DynamicChart = dynamic(() => import("./email-chart"), { ssr: true });

export default async function EmailContactsDashboard() {
  const contacts = await getContacts();

  // Process data for the graph - group by week
  const emailsPerWeek = contacts.reduce((acc: any, contact: any) => {
    const date = new Date(contact.created_at);
    // Get the week start date (Sunday)
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = `${weekStart.getFullYear()}-${String(
      weekStart.getMonth() + 1
    ).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
    acc[weekKey] = (acc[weekKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const graphData = Object.entries(emailsPerWeek)
    .map(([date, count]) => ({ date, count: count as number }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Email Contacts Over Time</CardTitle>
          <CardDescription>Number of new emails per week</CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicChart data={graphData} />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">
          Email Contacts - {contacts.length} Emails
        </h2>
        <Table>
          <TableCaption>A list of all email contacts.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Unsubscribed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact: any) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.email}</TableCell>
                <TableCell>
                  {new Date(contact.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{contact.unsubscribed ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
