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
  age: { type: Number },
  gender: { type: String },
  profilePicture: { type: String },
  joinedDate: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  chatHistory: [{ type: ChatSchema }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
