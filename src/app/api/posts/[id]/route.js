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

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const post = hardcodedPosts.find((p) => p._id === id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Get post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
