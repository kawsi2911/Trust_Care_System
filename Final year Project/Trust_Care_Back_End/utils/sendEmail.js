// sendEmail.js
import nodemailer from "nodemailer";

// Always use dotenv in this file if not already loaded in entry point
import dotenv from "dotenv";
dotenv.config();

export async function sendOTP(toEmail, otp) {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASS) {
      throw new Error("SMTP_EMAIL or SMTP_PASS not set in environment variables");
    }

    // Create transporter with debug enabled
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,  // your Gmail address
        pass: process.env.SMTP_PASS,   // Gmail App Password (if 2FA is on)
      },
      logger: true,   // logs to console
      debug: true,    // shows SMTP communication in console
    });

    const mailOptions = {
      from: `"Trust Care System" <${process.env.SMTP_EMAIL}>`,
      to: toEmail,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);

  } catch (err) {
    console.error("Failed to send OTP email:", err.message);
    console.error("Full error:", err);
    throw err;  // propagate so caller knows sending failed
  }
}