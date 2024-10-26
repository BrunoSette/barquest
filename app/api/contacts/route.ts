import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const contacts = await resend.contacts.list({
      audienceId: process.env.RESEND_AUDIENCE_ID as string,
    });
    
    return Response.json(contacts.data?.data ?? []);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return Response.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}
