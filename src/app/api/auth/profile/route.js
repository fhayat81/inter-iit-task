import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../lib/auth.js";
import connectDB from "../../../../../lib/mongodb.js";
import User from "../../../../../lib/models/User.js";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  avatar: z.string().url().optional().or(z.literal("")),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

export async function PUT(req) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    await connectDB();

    const user = await User.findOne({ _id: currentUser.userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update name
    if (validatedData.name) {
      user.name = validatedData.name;
    }

    // Update avatar
    if (validatedData.avatar !== undefined) {
      if (validatedData.avatar && validatedData.avatar.trim() !== "") {
        user.avatar = validatedData.avatar;
      } else {
        // Generate default avatar if empty
        user.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          validatedData.name
        )}&background=random&size=200`;
      }
    }

    // Update password if provided
    if (validatedData.currentPassword && validatedData.newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        validatedData.currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      // Hash and update new password
      const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    // Return updated user info (without password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      upvotedComments: user.upvotedComments,
    };

    return NextResponse.json({
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
