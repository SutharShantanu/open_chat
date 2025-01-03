import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoDB";
import User from "@/app/models/Users";
import bcrypt from "bcryptjs";
import sendEmail from "@/app/lib/nodemailer";
import generateUniqueUsername from "@/app/api/components/generateUniqueUsername";
import cloudinary from "@/app/lib/cloudinary";

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
      if (!existingUser.isVerified) {
        return NextResponse.json(
          {
            error: "User exists but is not verified. Please verify your email.",
            success: false,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    const username = await generateUniqueUsername();

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const defaultProfileImageUrl =
      "https://res.cloudinary.com/openchat07/image/upload/v1735818078/Users/profile/defaultprofile.svg";

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      verificationToken: otp,
      profilePicture: defaultProfileImageUrl,
      username,
    });
    await newUser.save();

    const verificationUrl = `https://${
      process.env.PROD_HOSTING_URL
    }/verify?email=${decodeURIComponent(email)}&otp=${otp}`;

    await sendEmail({
      to: email,
      subject: "Verify your email",
      text: `Hi ${firstName},\n\nThank you for registering on our platform. To complete your registration, please verify your email address by using the following OTP: ${otp}\n\nAlternatively, you can click the link below to verify your email:\n\n${verificationUrl}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nYour Company Team`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Hi ${firstName},</h2>
      <p>Thank you for registering on our platform. To complete your registration, please verify your email address by using the following OTP:</p>
      <p style="font-size: 1.2em; font-weight: bold; color: #333;">${otp}</p>
      <p>Alternatively, you can click the link below to verify your email:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 1em; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br>Your Company Team</p>
      </div>
      `,
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
