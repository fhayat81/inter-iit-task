import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import connectDB from "../../../../../lib/mongodb.js";
import User from "../../../../../lib/models/User.js";
import { generateToken, setAuthCookie } from "../../../../../lib/auth.js";

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z.string().url().optional().or(z.literal("")),
});

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      avatar: providedAvatar,
    } = validationResult.data;

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use provided avatar URL or generate one with user's name
    const avatar =
      providedAvatar && providedAvatar.trim() !== ""
        ? providedAvatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=random&size=200`;

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
