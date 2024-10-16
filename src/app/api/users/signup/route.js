import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoDB";
import User from "../../../../models/user";
import bcrypt from "bcryptjs";
import sendEmail from "../../../../lib/sendEmail"; // Assume this is your email sending function
import crypto from "crypto"; // For generating the OTP

export const POST = async (request) => {
  await connectDB();

  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      verificationToken: crypto.randomInt(1000, 9999).toString(), // Generate a 4-digit OTP
    });
    await newUser.save();

    // Send the OTP to the user's email
    await sendEmail({
      to: email,
      subject: "Your OTP for Email Verification",
      text: `Your OTP is ${newUser.verificationToken}. Please verify your email.`,
    });

    return NextResponse.json(
      {
        message: "User registered successfully. Please verify your email.",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error.message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
};
