<<<<<<< HEAD
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// hello

const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "TrendWave <onboarding@resend.dev>",
      to: [to],
=======
import nodemailer from "nodemailer";

import dotenv from "dotenv";

const result = dotenv.config();



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_PASSWORD exists:",
  !!process.env.EMAIL_PASSWORD
);


const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"TrendWave" <${process.env.EMAIL_USER}>`,
      to,
>>>>>>> 1d2d3940dfd50b5aad7d2e3e571d96b1fe5b878f
      subject,
      html,
    });

<<<<<<< HEAD
    if (error) {
      console.error("Resend Email Error:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data?.id);

    return data;
=======
    console.log("Email sent successfully");
>>>>>>> 1d2d3940dfd50b5aad7d2e3e571d96b1fe5b878f
  } catch (error) {
    console.error("Email Error:", error.message);
    throw error;
  }
};

export default sendEmail;