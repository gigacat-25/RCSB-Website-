export const runtime = 'edge';
import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { sendEmail } from "@/lib/email-utils";

const SUPER_ADMIN = "rscbadmin@rotract.com";

async function getAdminEmails(): Promise<string[]> {
  try {
    const admins: { email: string; role?: string }[] = await apiFetch("/api/authorized-admins");
    return admins
      .map((a) => a.email?.toLowerCase().trim())
      .filter((email): email is string => !!email && email !== SUPER_ADMIN);
  } catch (err) {
    console.error("[Contact] Failed to fetch admin list:", err);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Save inquiry to the worker DB (existing flow)
    const result = await apiFetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(body),
    });

    // 2. Fire admin notification emails (non-blocking)
    try {
      const { name, email, phone, reason, message } = body;
      const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

      // Fetch all appointed admin emails (exclude master admin)
      const adminEmails = await getAdminEmails();

      if (adminEmails.length === 0) {
        console.warn("[Contact] No admin emails found — skipping notification.");
      } else {
        const subject = `📬 New Inquiry: ${reason || "General"} — ${name || email}`;

        const emailBody = `
          <table style="width:100%;border-collapse:collapse;font-size:15px;">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#9aaabb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;width:130px;">Name</td>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#ffffff;font-weight:700;">${name || "—"}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#9aaabb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Email</td>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);"><a href="mailto:${email}" style="color:#C9982A;font-weight:700;">${email || "—"}</a></td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#9aaabb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Phone</td>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#ffffff;">${phone || "—"}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#9aaabb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Reason</td>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);"><span style="background:#C9982A20;color:#C9982A;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;">${reason || "General Inquiry"}</span></td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#9aaabb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Submitted</td>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#ffffff;">${submittedAt} IST</td>
            </tr>
          </table>
          <div style="margin-top:24px;background:rgba(255,255,255,0.05);border-left:3px solid #C9982A;border-radius:0 8px 8px 0;padding:16px 20px;">
            <p style="margin:0 0 6px;color:#9aaabb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Message</p>
            <p style="margin:0;color:#e0e8f0;font-size:15px;line-height:1.7;">${(message || "").replace(/\n/g, "<br/>")}</p>
          </div>
          <div style="margin-top:24px;">
            <a href="https://rcsb-website.pages.dev/admin/messages" style="display:inline-block;background:#C9982A;color:#0a0f1e;text-decoration:none;font-weight:900;padding:12px 24px;border-radius:8px;font-size:13px;letter-spacing:1px;">
              View in Admin Panel →
            </a>
          </div>
        `;

        // Send to all appointed admins in parallel
        await Promise.allSettled(
          adminEmails.map((adminEmail) =>
            sendEmail(adminEmail, subject, emailBody)
          )
        );

        console.log(`[Contact] Notification sent to ${adminEmails.length} admin(s):`, adminEmails);
      }
    } catch (emailErr) {
      // Never block the user's form submission
      console.error("[Contact] Admin notification failed:", emailErr);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
