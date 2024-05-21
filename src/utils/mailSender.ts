import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.elasticemail.com",
  port: 2525,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async (options: EmailOptions) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Error sending email");
  }
};
