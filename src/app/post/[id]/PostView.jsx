"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import Footer from "@/components/Footer";

export default function PostView({ post }) {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleCommentSubmit = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Post Card */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-48 md:h-64 object-cover"
            />
          )}
          <div className="p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {post.title}
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mb-4">
              Posted on {formatDate(post.createdAt)}
            </p>
            <div className="prose max-w-none">
              <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>
        </article>

        {/* Comment Form */}
        {isLoadingUser ? (
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : currentUser ? (
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Leave a Comment
            </h2>
            <CommentForm postId={post._id} onSubmit={handleCommentSubmit} />
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 mb-8">
            <p className="text-center text-sm md:text-base text-gray-700">
              Please{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:text-blue-700 font-semibold underline"
              >
                login
              </button>{" "}
              to leave a comment
            </p>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <CommentList
            key={refreshKey}
            postId={post._id}
            currentUser={currentUser}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
