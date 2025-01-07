import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoDB";
import User from "@/app/models/Users";

export const GET = async (req, context) => {
  await connectDB();

  try {
    const { email } = await context.params;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to fetch the profile." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("-password -__v");

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
};
