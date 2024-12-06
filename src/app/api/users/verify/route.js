import { NextResponse } from "next/server";

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

    // Check if the OTP is correct
    if (user.verificationToken !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP." },
        { status: 400 }
      );
    }

    // Update user's verification status
    user.isVerified = true;
    user.verificationToken = null; // Clear the OTP after verification
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
