import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoDB";
import User from "@/app/models/Users";
import bcrypt from "bcryptjs";
import sendEmail from "@/app/lib/nodemailer";

export const POST = async (request) => {
  await connectDB();

  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

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

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      verificationToken: otp,
    });
    await newUser.save();

    await sendEmail({
      to: email,
      firstName,
      emailType: "VERIFY",
      otp,
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
