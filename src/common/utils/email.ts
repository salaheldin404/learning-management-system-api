import { resend } from "@/config/resend";
import { env } from "@/config/env";
import type { SendEmailOptions } from "@/types/email";
import AppError from "@/common/errors/appError";

export async function sendEmail({
  to,
  subject,
  html,
  from,
  cc,
  bcc,
  replyTo,
}: SendEmailOptions): Promise<void> {
  try {
    await resend.emails.send({
      from: from ?? `${env.APP_NAME} <${env.EMAIL_FROM}>`,
      to: "salahlala303@gmail.com",
      subject,
      html,
      cc,
      bcc,
      replyTo,
    });
  } catch (error) {
    console.error("Failed to send email:", error);

    throw new AppError(
      "Unable to send email. Please try again later.",
      500
    );
  }
}