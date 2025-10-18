"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Comment from "./Comment";

export default function CommentList({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("recent"); // recent, upvotes, replies

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/posts/${postId}/comments?sortBy=${sortBy}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch comments (${response.status})`
        );
      }

      const data = await response.json();
      setComments(data.comments);
    } catch (err) {
      console.error("Fetch comments error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, sortBy]);

  const handleCommentUpdate = () => {
    fetchComments();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton for Sort Controls */}
        <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton Comments */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-4 shadow-sm animate-pulse"
            >
              <div className="flex items-start gap-3">
                {/* Avatar skeleton */}
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  {/* Name and time skeleton */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                  {/* Comment text skeleton */}
                  <div className="space-y-2 mb-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  {/* Action buttons skeleton */}
                  <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading comments: {error}</p>
        <button
          onClick={fetchComments}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex items-center justify-between bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-base md:text-xl font-bold text-black">
          Comments ({comments.length})
        </h2>
        <div className="flex items-center gap-2 md:gap-3">
          <label
            htmlFor="sort"
            className="text-xs md:text-sm font-medium text-black"
          >
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 md:px-4 py-1.5 md:py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-sm font-medium text-black bg-white hover:border-gray-400 transition-colors cursor-pointer outline-none"
          >
            <option value="recent">📅 Most Recent</option>
            <option value="upvotes">🔥 Most Upvoted</option>
            <option value="replies">💬 Most Replies</option>
          </select>
        </div>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="mt-4 text-sm md:text-base text-gray-600">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <motion.div layout className="space-y-4">
          <AnimatePresence mode="popLayout">
            {comments.map((comment, index) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05, // Stagger effect
                  ease: "easeOut",
                }}
              >
                <Comment
                  comment={comment}
                  postId={postId}
                  currentUser={currentUser}
                  onCommentUpdate={handleCommentUpdate}
                  depth={0}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
