import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "../../../../lib/mongodb.js";
import Comment from "../../../../lib/models/Comment.js";
import { requireAuth } from "../../../../lib/auth.js";

// Hardcoded valid post IDs
const validPostIds = ["1"];

// Validation schema
const commentSchema = z.object({
  text: z
    .string()
    .min(1, "Comment text is required")
    .max(2000, "Comment too long"),
  postId: z.string().min(1, "Post ID is required"),
  parentCommentId: z.number().optional().nullable(),
});

export async function POST(request) {
  try {
    // Check authentication
    const { user, error } = await requireAuth();
    if (error) return error;

    console.log("Creating comment for user:", user);

    const body = await request.json();
    console.log("Request body:", body);

    // Validate input
    const validationResult = commentSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { text, postId, parentCommentId } = validationResult.data;

    await connectDB();

    // Verify post exists (using hardcoded IDs)
    if (!validPostIds.includes(postId)) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If replying to a comment, verify it exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
    }

    console.log("Creating comment with userId:", user.userId);

    // Create comment
    const comment = await Comment.create({
      text,
      postId,
      userId: user.userId,
      parentCommentId: parentCommentId || null,
    });

    console.log("Comment created:", comment);

    // Populate user details
    await comment.populate("userId", "name avatar email");

    return NextResponse.json(
      {
        success: true,
        comment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create comment error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
