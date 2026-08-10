import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "TrendWave",
          email: process.env.BREVO_EMAIL,
        },
        to: [
          {
            email: to,
          },
        ],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Email sent successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Email Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export default sendEmail;