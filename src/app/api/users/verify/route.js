import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoDB";
import User from "@/app/models/Users";
import { signIn } from "next-auth/react";

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

    const token = signIn(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      {
        message: "Email verified successfully.",
        success: true,
        token,
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
