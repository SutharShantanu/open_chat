import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoDB";
import User from "@/app/models/Users";

export const GET = async (req, { params }) => {
  await connectDB();

  try {
    const { email } = params;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to fetch the profile." },
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await User.findOne({ email }).select("-password -__v");

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Return the user data as JSON
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
};
