import transporter from "./Email.js";

// Export sendEmails function using ES6 export syntax
export const sendEmails = async (from, to, subject,htmlContent) => {
    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: htmlContent
    };

    // Email Send 
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error.message);
                reject(error);  // Reject the promise with the error
            } else {
                console.log('Email sent:', info.response);
                resolve(info.response);  // Resolve the promise with the info
            }
        });
    });
};
