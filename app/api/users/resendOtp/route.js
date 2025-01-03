import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoDB";
import Users from "@/app/models/Users";
import sendEmail from "@/app/lib/nodemailer";

export const POST = async (request) => {
  await connectDB();

  try {
    const { email } = await request.json();

    const user = await Users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();

    user.verificationToken = newOtp;
    await user.save();

    const verificationUrl = `https://${
      process.env.PROD_HOSTING_URL
    }/verify?email=${encodeURIComponent(user.email)}&otp=${newOtp}`;

    await sendEmail({
      to: user.email,
      subject: "Resend OTP - Verify Your Email",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Resend OTP</h2>
        <p>Dear ${user.name},</p>
        <p>We have received a request to resend your OTP. Your new OTP is:</p>
        <p style="font-size: 24px; font-weight: bold; color: #333;">${newOtp}</p>
        <p>Please verify your email by clicking the following link:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you,<br/>OpenChat Team</p>
      </div>
      `,
    });

    return NextResponse.json(
      { message: "OTP resent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP error:", error.message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
};
