import nodemailer from 'nodemailer';
import { SEND_EMAIL_LINK, Verification_Email_Template } from "@/email/EmailTemplate";

const emailConfig = {
    service: "gmail",
    auth: {
        user: process.env.PORTAL_EMAIL,
        pass: process.env.PORTAL_PASSWORD,
    },
};

async function sendEmailOTP(mail:string, otp: string) {
    const transporter = nodemailer.createTransport(emailConfig);
    const mailOptions = {
        from: process.env.PORTAL_EMAIL,
        to: mail, 
        subject: "OTP Verification",
        html: Verification_Email_Template(otp), 
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            success: true,
            message: `OTP sent to ${mail} via email`,
        };
    } catch (error) {
        return {
            success: false,
            message: `Error sending OTP to ${mail} via email: ${error}`,
        };
    }
}



async function sendEmailLink(mail:string, link:string) { 
    console.log(link);
    const transporter = nodemailer.createTransport(emailConfig);
    const mailOptions = {
        from: process.env.PORTAL_EMAIL,
        to: mail, 
        subject: "RESET PASSWORD",
        html: SEND_EMAIL_LINK(link), // html body 
    };

    try {
        await transporter.sendMail(mailOptions);
        return `OTP sent to ${mail} via email`;
    } catch (error) {
        throw `Error sending OTP to ${mail} via email: ${error}`;
    }
}


export { sendEmailOTP, sendEmailLink }