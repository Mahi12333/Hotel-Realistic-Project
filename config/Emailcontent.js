export const htmlContent_1=async (otp) => {
    return `<!Doctype html>
                <html>
                <head></head>
                <body>
                    <h1><strong>${otp}</strong></h1>
                </body>
                </html>`
}

export const htmlContent_2=async (resetLink) => {
    return `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Password Reset Request</h2>
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>
                    Please click on the following link, or paste this into your browser to complete the process:
                    <br>
                    <a href="${resetLink}" style="color: #007bff; text-decoration: none;">${resetLink}</a>
                </p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                <br>
                <p>Thank you,</p>
                <p>Invespy Team</p>
            </div>`
}
