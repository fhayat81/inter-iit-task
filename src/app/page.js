import { notFound } from "next/navigation";
import PostView from "./post/[id]/PostView";

async function getPost() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/posts/1`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function Home() {
  const post = await getPost();

  if (!post) {
    notFound();
  }

  return <PostView post={post} />;
}
