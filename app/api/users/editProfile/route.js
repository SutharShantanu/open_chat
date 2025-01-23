import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongoDB";
import User from "@/app/models/Users";
import cloudinary from "@/app/lib/cloudinary";

export const POST = async (request) => {
    await connectDB();

    try {
        const body = await request.json();
        const { id, firstName, lastName, username, email, occupation, location, age, gender } = body;

        if (!id || (!firstName && !lastName && !username && !email && !occupation && !location && !age && !gender)) {
            return NextResponse.json(
            { error: "ID and at least one field to update are required." },
            { status: 400 }
            );
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (username) user.username = username;
        if (email) user.email = email;
        if (occupation) user.occupation = occupation;
        if (location) user.location = location;
        if (age) user.age = age;
        if (gender) user.gender = gender;

        await user.save();

        return NextResponse.json(
            { message: "Profile updated successfully", user },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating profile:", error.message);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
};

export const PUT = async (request) => {
    await connectDB();

    try {
        const body = await request.json();
        const { id, image } = body;

        if (!id || !image) {
            return NextResponse.json(
                { error: "ID and image are required." },
                { status: 400 }
            );
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        const result = await cloudinary.uploader.upload(image, {
            folder: "Users/profile",
        });

        user.profilePicture = result.secure_url;

        await user.save();

        return NextResponse.json(
            { message: "Profile picture updated successfully", user },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating profile picture:", error.message);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
};