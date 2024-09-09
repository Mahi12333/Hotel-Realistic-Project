
import { sendEmails } from "../config/sendEmail.js";
import { Emailverify } from "../models/index.js";
import { ApiError } from "./ApiErrors.js";
import { ApiResponse } from "./ApiReponse.js";
import dotenv from "dotenv";
dotenv.config();

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
const sendHtmlContent=  (otp) => {
    return `<!Doctype html>
                <html>
                <head></head>
                <body>
                    <h1><strong>${otp}</strong></h1>
                </body>
                </html>`
}
const handleOtpProcess = async (user, res) => {
    let otpUser = await Emailverify.findOne({ where: { email: user.email } });

    if (otpUser && new Date() > otpUser.expires_at) {
        await Emailverify.destroy({ where: { email: user.email } });
        otpUser = null; // Reset otpUser since the expired one has been destroyed
    }

    const sendOtpEmail = async (otp, recipientEmail) => {
        const fromEmail = process.env.NODEMAILER_EMAIL;
        const subject = "Invespy Send Otp";
        const htmlContent = sendHtmlContent(otp);
        return await sendEmails(fromEmail, recipientEmail.trim(), subject, htmlContent);
    };

    if (otpUser) {
        const { otp, email } = otpUser;
        const emailSent = await sendOtpEmail(otp, email);

        if (emailSent) {
            return res.status(200).json(
                new ApiResponse(200, otpUser, "OTP sent to email successfully. Please check your inbox.")
            );
        }
    } else {
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 2 * 60000); // 2 minutes
        const emailSent = await sendOtpEmail(otp, user.email);

        if (emailSent) {
            const otpSend = await Emailverify.create({
                email: user.email,
                otp,
                expires_at: expiresAt
            });

            return res.status(200).json(
                new ApiResponse(200, otpSend, "OTP sent to email successfully. Please check your inbox.")
            );
        } else {
            throw new ApiError(400, "Failed to send OTP.");
        }
    }
};
export default handleOtpProcess;