import { NextResponse } from "next/server";
import connectDB from "../../../../../../lib/mongodb.js";
import Comment from "../../../../../../lib/models/Comment.js";
import User from "../../../../../../lib/models/User.js";
import { requireAuth } from "../../../../../../lib/auth.js";

export async function PUT(request, { params }) {
  try {
    const { user, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const commentId = parseInt(id);

    await connectDB();

    // Get the user ID from the JWT token (it's stored as userId, not id)
    const currentUserId = user.userId;

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Invalid user session" },
        { status: 401 }
      );
    }

    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Get current user to check upvote status
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hasUpvoted =
      currentUser.upvotedComments?.includes(commentId) || false;

    // Perform atomic updates on both user and comment
    if (hasUpvoted) {
      // Remove upvote
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { upvotedComments: commentId },
      });
      await Comment.findByIdAndUpdate(commentId, {
        $inc: { upvotes: -1 },
      });
    } else {
      // Add upvote
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { upvotedComments: commentId },
      });
      await Comment.findByIdAndUpdate(commentId, {
        $inc: { upvotes: 1 },
      });
    }

    // Get updated comment with new upvote count
    const updatedComment = await Comment.findById(commentId);

    // Ensure non-negative upvotes
    if (updatedComment.upvotes < 0) {
      updatedComment.upvotes = 0;
      await updatedComment.save();
    }

    return NextResponse.json({
      success: true,
      upvotes: updatedComment.upvotes,
      hasUpvoted: !hasUpvoted,
    });
  } catch (error) {
    console.error("Upvote comment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
