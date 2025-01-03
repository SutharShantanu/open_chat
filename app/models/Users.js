import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  message: String,
  timestamp: Date,
  sender: String,
});

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  profilePicture: { type: String, default: "https://res.cloudinary.com/openchat07/image/upload/v1735818078/Users/profile/defaultprofile.svg" },
  joinedDate: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  chatHistory: [{ type: ChatSchema }],
  username: { type: String, unique: true },
  occupation: { type: String },
  location: { type: String },
  gender: { type: String },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
