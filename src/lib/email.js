import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

let transporter;

async function initializeTransporter() {
  if (process.env.NODE_ENV === 'production' || process.env.EMAIL_SERVER_HOST) {
    if (!process.env.EMAIL_SERVER_HOST) {
      console.error("Production environment is missing EMAIL_SERVER_HOST.");
      return null;
    }
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || "587", 10),
      secure: (process.env.EMAIL_SERVER_PORT === "465"),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    console.log("📧 Ethereal test account created. User: %s, Pass: %s", testAccount.user, testAccount.pass);
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  return transporter;
}

/**
 * Sends an email using the configured Nodemailer transport.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {React.ReactElement} react - The React component to render as the email body.
 * @returns {Promise<object>} - The result from Nodemailer.
 */
export async function sendEmail({ to, subject, react }) {
  if (!transporter) {
    await initializeTransporter();
  }

  if (!transporter) {
    throw new Error("Email transporter could not be initialized.");
  }

  const html = await render(react);

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Your App" <noreply@example.com>',
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  if (process.env.NODE_ENV !== 'production' && !process.env.EMAIL_SERVER_HOST) {
    console.log("✉️ Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }

  return info;
}
