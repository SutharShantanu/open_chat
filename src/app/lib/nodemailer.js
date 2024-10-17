import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, firstName, emailType, otp }) => {
  let subject;
  let text;

  if (emailType === "VERIFY") {
    subject = "Verify your email address";
    text = `Hello ${firstName},

    Thank you for registering! Please verify your email address by using the following OTP:

    OTP: ${otp}

    If you did not request this verification, please ignore this email.

    Best regards,
    Your Team`;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    });
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed.");
  }
};

export default sendEmail;