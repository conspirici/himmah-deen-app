import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "No message" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: "Himmah Feedback <onboarding@resend.dev>",
      to: [process.env.FEEDBACK_EMAIL!],
      subject: "🌙 New Himmah Feedback",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #F2E6DE; border-radius: 16px;">
          <h2 style="color: #3B1918; margin: 0 0 8px 0; font-size: 18px;">New feedback from Himmah</h2>
          <p style="color: #7A5650; font-size: 12px; margin: 0 0 24px 0;">${new Date().toLocaleString()}</p>
          <div style="background: white; padding: 20px; border-radius: 12px; color: #3B1918; font-size: 15px; line-height: 1.6;">
            ${message.replace(/\n/g, "<br/>")}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Email delivery failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Feedback error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
