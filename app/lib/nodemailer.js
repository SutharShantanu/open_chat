import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (options) => {
  const { to, subject, text, html } = options;

  if (!to || !subject || !text) {
    const missingValues = [];
    if (!to) missingValues.push("to");
    if (!subject) missingValues.push("subject");
    if (!text) missingValues.push("text");

    const errorMessage = `Missing values: ${missingValues.join(", ")}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed.");
  }
};

export default sendEmail;
