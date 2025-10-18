import { NextResponse } from "next/server";
import connectDB from "../../../../../../lib/mongodb.js";
import Comment from "../../../../../../lib/models/Comment.js";

/**
 * Build nested comment structure recursively
 */
function buildCommentTree(comments, parentId = null) {
  const tree = [];

  for (const comment of comments) {
    if (String(comment.parentCommentId) === String(parentId)) {
      const children = buildCommentTree(comments, comment._id);
      const commentObj = {
        ...comment,
        replies: children,
        replyCount: children.length,
      };
      tree.push(commentObj);
    }
  }

  return tree;
}

export async function GET(request, { params }) {
  try {
    const { id: postId } = await params;
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy") || "recent"; // recent, upvotes, replies

    await connectDB();

    // Fetch all comments for the post
    let comments = await Comment.find({ postId })
      .populate("userId", "name avatar email")
      .lean();

    // Sort comments based on sortBy parameter
    if (sortBy === "upvotes") {
      comments.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === "replies") {
      // Count replies for each comment
      const replyCounts = {};
      comments.forEach((comment) => {
        if (comment.parentCommentId) {
          const parentId = String(comment.parentCommentId);
          replyCounts[parentId] = (replyCounts[parentId] || 0) + 1;
        }
      });
      comments.sort((a, b) => {
        const aCount = replyCounts[String(a._id)] || 0;
        const bCount = replyCounts[String(b._id)] || 0;
        return bCount - aCount;
      });
    } else {
      // Sort by most recent (default)
      comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Build nested comment tree
    const commentTree = buildCommentTree(comments, null);

    return NextResponse.json({
      comments: commentTree,
      total: comments.length,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
