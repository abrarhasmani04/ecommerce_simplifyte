import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

console.log(
  "RESEND API KEY EXISTS:",
  !!process.env.RESEND_API_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "TrendWave <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend Email Error:", error);
      throw new Error(error.message);
    }

    console.log("✅ Email sent successfully:", data?.id);

    return data;
  } catch (error) {
    console.error("❌ Email Error:", error);
    throw error;
  }
};

export default sendEmail;