import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import logger from './logger';

/**
 * Sends an email.
 * In development, it uses Ethereal.email.
 * In production, it uses the configured SMTP transport.
 * @param {{to: string, subject: string, react: React.ReactElement}} mailOptions
 */
export async function sendEmail({ to, subject, react }) {
  
  let transporter;
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.EMAIL_SERVER_HOST) {
      logger.error("Production environment is missing EMAIL_SERVER_HOST.");
      throw new Error("Email server is not configured.");
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
    // Use Ethereal for development to avoid sending real emails
    const testAccount = await nodemailer.createTestAccount();
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

  // CORRECTED: Await the render function to get the HTML string
  const html = await render(react);

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Moly" <noreply@moly.com>',
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  if (process.env.NODE_ENV !== 'production') {
    logger.info("✉️ Dev email sent! Preview URL: ", nodemailer.getTestMessageUrl(info));
  }

  return info;
}