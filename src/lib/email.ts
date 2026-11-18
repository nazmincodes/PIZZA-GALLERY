import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailProps = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail({
  to,
  subject,
  text,
}: SendEmailProps) {
  const { error } = await resend.emails.send({
    from: "PizzaHub <onboarding@resend.dev>",
    to,
    subject,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }
}