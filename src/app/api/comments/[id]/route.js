import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb.js";
import Comment from "../../../../../lib/models/Comment.js";
import User from "../../../../../lib/models/User.js";
import { requireAuth, isAdmin } from "../../../../../lib/auth.js";

export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const { user, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const commentId = parseInt(id);

    await connectDB();

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Get user details to check email for admin
    const currentUser = await User.findById(user.userId);

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user owns the comment or is admin (by email)
    const isOwner = String(comment.userId) === String(user.userId);
    const isUserAdmin = currentUser.email === "admin@example.com";

    console.log("Delete attempt:", {
      userId: user.userId,
      commentUserId: comment.userId,
      userEmail: currentUser.email,
      isOwner,
      isUserAdmin,
    });

    if (!isOwner && !isUserAdmin) {
      return NextResponse.json(
        { error: "Unauthorized to delete this comment" },
        { status: 403 }
      );
    }

    // Admin can soft delete with admin marker, user can only soft delete their own comments
    if (isUserAdmin) {
      comment.isDeleted = true;
      comment.deletedBy = "admin";
      await comment.save();
      return NextResponse.json({
        success: true,
        message: "Comment deleted by admin",
      });
    } else {
      // Soft delete - keep comment but mark as deleted by user
      comment.isDeleted = true;
      comment.deletedBy = "user";
      await comment.save();
      return NextResponse.json({
        success: true,
        message: "Comment deleted",
      });
    }
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
