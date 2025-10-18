import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "../../../../../../lib/mongodb.js";
import Comment from "../../../../../../lib/models/Comment.js";
import { requireAuth } from "../../../../../../lib/auth.js";

// Validation schema
const replySchema = z.object({
  text: z.string().min(1, "Reply text is required").max(2000, "Reply too long"),
});

export async function POST(request, { params }) {
  try {
    // Check authentication
    const { user, error } = await requireAuth();
    if (error) return error;

    console.log("Creating reply for user:", user);

    const { id } = await params;
    const parentCommentId = parseInt(id);
    const body = await request.json();

    console.log("Parent comment ID:", parentCommentId);
    console.log("Request body:", body);

    // Validate input
    const validationResult = replySchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { text } = validationResult.data;

    await connectDB();

    // Verify parent comment exists
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      console.error("Parent comment not found:", parentCommentId);
      return NextResponse.json(
        { error: "Parent comment not found" },
        { status: 404 }
      );
    }

    console.log("Creating reply with userId:", user.userId);

    // Create reply with the same postId as parent
    const reply = await Comment.create({
      text,
      postId: parentComment.postId,
      userId: user.userId,
      parentCommentId,
    });

    console.log("Reply created:", reply);

    // Populate user details
    await reply.populate("userId", "name avatar email");

    return NextResponse.json(
      {
        success: true,
        comment: reply,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create reply error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
