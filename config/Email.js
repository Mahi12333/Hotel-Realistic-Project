import dotenv from 'dotenv';
dotenv.config({
    path:'./env',
})
import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.NODEMAILER_EMAIL, // Admin Gmail ID
    pass: process.env.NODEMAILER_GMAIL_APP_PASSWORD, // Admin Gmail Password
  },
})

export default transporter;