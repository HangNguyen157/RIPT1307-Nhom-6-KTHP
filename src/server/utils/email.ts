import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || 'smtp.mailtrap.io';
const smtpPort = parseInt(process.env.SMTP_PORT || '2525', 10);
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';
const smtpFrom = process.env.SMTP_FROM || 'noreply@eduforum.vn';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: smtpUser && smtpPass ? {
    user: smtpUser,
    pass: smtpPass,
  } : undefined,
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: smtpFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`[Email] Đã gửi email tới ${options.to}`);
  } catch (error) {
    console.error(`[Email] Lỗi gửi email tới ${options.to}:`, error);
  }
}

export async function notifyNewPost(postId: string, authorEmail: string): Promise<void> {
  const postUrl = `${process.env.APP_URL || 'http://localhost:8000'}/post/${postId}`;
  await sendEmail({
    to: authorEmail,
    subject: '[EduForum] Bài viết mới của bạn đã được đăng thành công!',
    html: `
      <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
        <h2 style="color: #dc2626;">Đăng bài thành công!</h2>
        <p>Xin chào,</p>
        <p>Bài viết của bạn đã được tải lên diễn đàn học thuật EduForum. Bạn có thể xem chi tiết bài viết tại đường dẫn dưới đây:</p>
        <p style="margin: 20px 0;">
          <a href="${postUrl}" style="background-color: #dc2626; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Xem bài viết</a>
        </p>
        <p>Cảm ơn bạn đã đóng góp câu hỏi/kiến thức cho cộng đồng.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">Đây là email tự động từ EduForum. Vui lòng không trả lời email này.</p>
      </div>
    `,
  });
}

export async function notifyNewReply(
  postId: string,
  recipientEmail: string,
): Promise<void> {
  const postUrl = `${process.env.APP_URL || 'http://localhost:8000'}/post/${postId}`;
  await sendEmail({
    to: recipientEmail,
    subject: '[EduForum] Có phản hồi mới cho bài viết của bạn!',
    html: `
      <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
        <h2 style="color: #dc2626;">Có bình luận/phản hồi mới!</h2>
        <p>Xin chào,</p>
        <p>Một câu trả lời hoặc bình luận mới vừa được đăng tải trên bài viết liên quan của bạn tại EduForum.</p>
        <p style="margin: 20px 0;">
          <a href="${postUrl}" style="background-color: #dc2626; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Xem phản hồi</a>
        </p>
        <p>Tham gia thảo luận ngay để cùng trao đổi học thuật.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">Đây là email tự động từ EduForum. Vui lòng không trả lời email này.</p>
      </div>
    `,
  });
}

