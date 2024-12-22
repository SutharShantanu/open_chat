import { NextResponse } from "next/server";
import User from "@/app/models/Users";
import connectDB from "@/app/lib/mongoDB";


export const POST = async (request) => {
  await connectDB();

  try {
    const { email, otp } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    if (user.verificationToken !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP." },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return NextResponse.json(
      {
        message: "Email verified successfully.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error.message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
};
