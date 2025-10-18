import { NextResponse } from "next/server";

// Hardcoded posts data
const hardcodedPosts = [
  {
    _id: "1",
    title: "Welcome to CommentHub",
    content:
      "This is a demonstration of our nested commenting system. Feel free to explore and leave comments!",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
    createdAt: new Date("2024-01-15").toISOString(),
  },
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = parseInt(searchParams.get("skip")) || 0;

    // Simulate database query with hardcoded data
    const posts = hardcodedPosts.slice(skip, skip + limit);
    const total = hardcodedPosts.length;

    return NextResponse.json({
      posts,
      total,
      hasMore: skip + posts.length < total,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
