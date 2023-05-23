import nodemailer from "nodemailer";
import {email, email_password} from "../config/vars.js";

const sendEmail = async (email_user, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            secure: true,
            auth: {
                user: email,
                pass: email_password,
            },
        });

        await transporter.sendMail({
            from: email,
            to: email_user,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

export default sendEmail;