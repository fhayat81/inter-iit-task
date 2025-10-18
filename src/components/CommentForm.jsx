"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function CommentForm({
  postId,
  parentCommentId = null,
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
}) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = parentCommentId
        ? `/api/comments/${parentCommentId}/reply`
        : "/api/comments";

      // Prepare request body based on endpoint
      const requestBody = parentCommentId
        ? { text: text.trim() } // Reply route only needs text
        : { text: text.trim(), postId, parentCommentId: null }; // Comment route needs text, postId, and parentCommentId

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error("Server error response:", data);
        console.error("Response status:", response.status);
        throw new Error(data.error || "Failed to post comment");
      }

      toast.success(parentCommentId ? "Reply posted!" : "Comment posted!");
      setText("");
      onSubmit?.();
    } catch (error) {
      console.error("Submit comment error:", error);
      toast.error(error.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        disabled={isSubmitting}
        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg text-sm md:text-base text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        rows={3}
        maxLength={2000}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs md:text-sm text-gray-500">
          {text.length}/2000
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Posting..."
              : parentCommentId
              ? "Reply"
              : "Comment"}
          </button>
        </div>
      </div>
    </form>
  );
}
