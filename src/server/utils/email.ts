/**
 * Mail service — gửi email bất đồng bộ (NFR-03).
 * @todo Cấu hình SMTP_* trong .env và kích hoạt nodemailer
 */

// import nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(_options: SendEmailOptions): Promise<void> {
  // const transporter = nodemailer.createTransport({ ... });
  // await transporter.sendMail({ from: process.env.SMTP_FROM, ...options });
  return Promise.resolve();
}

export async function notifyNewPost(
  _postId: string,
  _authorEmail: string,
): Promise<void> {
  return Promise.resolve();
}

export async function notifyNewReply(
  _postId: string,
  _recipientEmail: string,
): Promise<void> {
  return Promise.resolve();
}
