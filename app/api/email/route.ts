import { NextResponse } from "next/server";
import sendGrid from "@sendgrid/mail";
import { sendSuccess } from "@/lib/responseHandler";
import { ValidationError, DatabaseError } from "@/lib/customErrors";
import { withErrorHandler } from "@/lib/errorHandler";

sendGrid.setApiKey(process.env.SENDGRID_API_KEY!);

async function POST(req: Request) {
  const { to, subject, message } = await req.json();
  const emailData = {
    to,
    from: process.env.SENDGRID_SENDER!,
    subject,
    html: message,
  };
  const response = await sendGrid.send(emailData);
  console.log("Email send", response[0].headers);
  return sendSuccess(
    { messageId: response[0].headers["x-message-id"] },
    "Email sent successfully"
  );
}

export const welcomeTemplate = (userName: string) => `
  <h2>Welcome to TrustNet, ${userName}!</h2>
  <p>We’re thrilled to have you onboard 🎉</p>
  <p>Start exploring your dashboard at <a href="">Kalvium Portal</a>.</p>http://localhost:3000
  <hr/>
  <small>This is an automated email. Please do not reply.</small>
`;

export const POSTHandler = withErrorHandler(POST, "email-send");
export { POSTHandler as POST };