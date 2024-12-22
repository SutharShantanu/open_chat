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
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();

    user.verificationToken = newOtp;
    await user.save();

    await sendEmail({
      to: user.email,
      emailType: "VERIFY",
      otp: newOtp,
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
