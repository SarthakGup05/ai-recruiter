import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create a generic transporter
// In a real production scenario, use environment variables for this.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER || "test_user",
    pass: process.env.SMTP_PASS || "test_pass",
  },
});

export const sendStatusEmail = async (
  candidateEmail: string,
  candidateName: string,
  jobTitle: string,
  newStatus: string,
) => {
  const statusMessages: Record<string, { subject: string; body: string }> = {
    applied: {
      subject: `Application Received: ${jobTitle}`,
      body: `Hi ${candidateName},<br><br>We have successfully received your application for the ${jobTitle} position. We will review your profile and get back to you soon.`,
    },
    interviewed: {
      subject: `Interview Update: ${jobTitle}`,
      body: `Hi ${candidateName},<br><br>Thank you for completing the interview for ${jobTitle}. We are currently evaluating all candidates and will reach out with next steps.`,
    },
    rejected: {
      subject: `Update on your application for ${jobTitle}`,
      body: `Hi ${candidateName},<br><br>Thank you for taking the time to apply for the ${jobTitle} role. While your background is impressive, we have decided to move forward with other candidates at this time.`,
    },
    hired: {
      subject: `Offer Extended: ${jobTitle}!!`,
      body: `Hi ${candidateName},<br><br>Congratulations! We are thrilled to offer you the ${jobTitle} position. Our team will be in touch shortly with the official offer details!`,
    },
  };

  const emailContent = statusMessages[newStatus] || {
    subject: `Application Status Update: ${jobTitle}`,
    body: `Hi ${candidateName},<br><br>Your application status for ${jobTitle} has been updated to: <strong>${newStatus}</strong>.`,
  };

  try {
    const info = await transporter.sendMail({
      from:
        process.env.SMTP_FROM || '"AI Recruiter" <no-reply@airecruiter.com>',
      to: candidateEmail,
      subject: emailContent.subject,
      html: emailContent.body,
    });
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
