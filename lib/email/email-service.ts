import { InviteUserEmail } from "@/emails/invite";
import { ResetPasswordEmail } from "@/emails/reset-password";
import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/welcome";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvitationEmail(
  to: string,
  firstName: string,
  invitedByUsername: string,
  invitedByEmail: string,
  teamName: string,
  inviteId: string,
  role: string
) {
  const subject = `${invitedByUsername} has invited you to join ${teamName} on BARQUEST`;

  if (!process.env.RESEND_AUTHORIZED_EMAIL) {
    return { error: "RESEND_AUTHORIZED_EMAIL is not set" };
  }

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_AUTHORIZED_EMAIL,
    to,
    subject,
    react: InviteUserEmail({
      firstName: firstName,
      invitedByUsername: invitedByUsername,
      invitedByEmail: invitedByEmail,
      teamName: teamName,
      inviteId: inviteId,
      role: role,
    }),
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function sendResetPasswordEmail(
  to: string,
  username: string,
  token: string
) {
  const subject = `Reset your password on BARQUEST`;

  if (!process.env.RESEND_AUTHORIZED_EMAIL) {
    return { error: "RESEND_AUTHORIZED_EMAIL is not set" };
  }

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_AUTHORIZED_EMAIL,
    to,
    subject,
    react: ResetPasswordEmail({
      username,
      email: to,
      resetPasswordLink: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`,
    }),
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function sendWelcomeEmail(email: string) {
  try {
    const fiveMinuteFromNow = new Date(Date.now() + 5000 * 60).toISOString();

    const { data, error } = await resend.emails.send({
      from: "BarQuest <support@barquest.ca>",
      to: [email],
      subject: "Welcome to BarQuest",
      react: WelcomeEmail(email),
      scheduledAt: fiveMinuteFromNow,
    });

    if (error) {
      console.error("Failed to send welcome email:", error);
      return { error };
    }

    return { data };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { error };
  }
}
