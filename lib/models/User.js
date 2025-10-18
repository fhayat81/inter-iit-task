import mongoose from "mongoose";
import { randomUUID } from "crypto";

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => randomUUID(),
  },
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  avatar: {
    type: String,
    default: "https://ui-avatars.com/api/?background=random",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  upvotedComments: {
    type: [Number],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model recompilation during hot reload in development
export default mongoose.models.User || mongoose.model("User", UserSchema);
