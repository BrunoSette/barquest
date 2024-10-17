import { resend } from "@/lib/email/resend";
import UnsubscribeDialog from "@/components/UnsubscribeDialog";
import { Metadata } from 'next';

// Server-side function to handle unsubscription
async function handleUnsubscribe(email: string): Promise<string> {
  if (!email) {
    console.error("No email provided");
    return "No email provided";
  }

  try {
    await resend.contacts.remove({
      email: email,
      audienceId: "7c43c8a9-1840-4029-b11f-496cd7e75a6e",
    });
    return `The email ${email} has been unsubscribed from BarQuest.`;
  } catch (error) {
    console.error("Failed to unsubscribe:", error);
    return "Failed to unsubscribe. Please try again.";
  }
}

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: 'Unsubscribe from BarQuest emails',
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const UnsubscribePage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const email = typeof params.email === 'string' ? params.email : '';
  const message = await handleUnsubscribe(email);

  return <UnsubscribeDialog email={email} message={message} />;
};

export default UnsubscribePage;
