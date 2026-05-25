import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

router.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    res.status(400).json({ success: false, error: "name, email and message are required" });
    return;
  }

  const toEmail = process.env.CONTACT_EMAIL;
  const appPassword = process.env.CONTACT_APP_PASSWORD;

  if (!toEmail || !appPassword) {
    req.log.warn("CONTACT_EMAIL or CONTACT_APP_PASSWORD not configured");
    res.status(503).json({
      success: false,
      error: "Email service not configured — please set CONTACT_EMAIL and CONTACT_APP_PASSWORD secrets.",
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: toEmail, pass: appPassword },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${toEmail}>`,
      to: toEmail,
      replyTo: `"${name}" <${email}>`,
      subject: subject || `Portfolio message from ${name}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#F8FAFC;padding:32px;border-radius:12px">
          <h2 style="color:#0F172A;margin:0 0 24px">New message from your portfolio</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#64748B;width:80px">Name</td><td style="padding:8px 0;color:#0F172A;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748B">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#3B82F6">${email}</a></td></tr>
            ${subject ? `<tr><td style="padding:8px 0;color:#64748B">Subject</td><td style="padding:8px 0;color:#0F172A">${subject}</td></tr>` : ""}
          </table>
          <div style="margin-top:24px;padding:20px;background:#FFFFFF;border-radius:8px;border:1px solid #E2E8F0">
            <p style="color:#334155;line-height:1.7;margin:0;white-space:pre-wrap">${message}</p>
          </div>
          <p style="color:#94A3B8;font-size:12px;margin-top:24px">
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
    });

    req.log.info({ from: email }, "Contact form email sent");
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send contact email");
    res.status(500).json({ success: false, error: "Failed to send email. Please try again." });
  }
});

export default router;
