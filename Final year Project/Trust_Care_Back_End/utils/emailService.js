import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || "mumzack98@gmail.com",
        pass: process.env.EMAIL_PASS || "pnfa nxii xojj jzcq",
    },
});

// ✅ Send verification email
export const sendVerificationEmail = async (toEmail, name, token, role) => {
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyUrl = `${baseUrl}/verify-email?token=${token}&role=${role}`;

    const mailOptions = {
        from: `"Trust Care System" <${process.env.EMAIL_USER || "mumzack98@gmail.com"}>`,
        to: toEmail,
        subject: "✅ Verify Your Trust Care Account",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <div style="background: #2196f3; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0;">Trust Care System</h1>
                <p style="color: #e3f2fd; margin: 5px 0 0 0;">Connecting Hearts with Helping Hands</p>
            </div>

            <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px;">
                <h2 style="color: #1a237e;">Hello, ${name}! 👋</h2>
                <p style="color: #555; font-size: 1rem; line-height: 1.6;">
                    Thank you for registering with Trust Care System. Please verify your email address to activate your account.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyUrl}" 
                       style="background: #2196f3; color: white; padding: 14px 32px; 
                              border-radius: 6px; text-decoration: none; font-size: 1rem; 
                              font-weight: bold; display: inline-block;">
                        ✅ Verify My Email
                    </a>
                </div>

                <p style="color: #888; font-size: 0.85rem;">
                    Or copy and paste this link in your browser:
                </p>
                <p style="color: #2196f3; font-size: 0.85rem; word-break: break-all;">
                    ${verifyUrl}
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

                <p style="color: #999; font-size: 0.8rem;">
                    ⚠️ This link expires in 24 hours. If you did not register, please ignore this email.
                </p>

                <p style="color: #999; font-size: 0.8rem;">
                    © 2026 Trust Care System. All rights reserved.
                </p>
            </div>

        </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};