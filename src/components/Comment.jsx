"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import CommentForm from "./CommentForm";
import ConfirmModal from "./ConfirmModal";

export default function Comment({
  comment,
  postId,
  currentUser,
  onCommentUpdate,
  depth = 0,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(
    currentUser ? currentUser.upvotedComments?.includes(comment._id) : false
  );
  const [upvoteAnimationKey, setUpvoteAnimationKey] = useState(0);
  const [isUpvoteAction, setIsUpvoteAction] = useState(true); // true = upvote, false = remove
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const maxDepth = 6; // Maximum nesting depth
  const indentClass =
    depth > 0
      ? `ml-${Math.min(depth * 4, 12)} pl-4 border-l-2 border-gray-200`
      : "";

  const handleUpvote = async () => {
    if (!currentUser) {
      toast.error("Please login to upvote");
      return;
    }

    if (isUpvoting) return;

    setIsUpvoting(true);
    try {
      const response = await fetch(`/api/comments/${comment._id}/upvote`, {
        method: "PUT",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to upvote");
      }

      const data = await response.json();
      setIsUpvoteAction(data.hasUpvoted); // Track if it's upvote or removal
      setUpvotes(data.upvotes);
      setHasUpvoted(data.hasUpvoted);
      setUpvoteAnimationKey((prev) => prev + 1); // Trigger animation
      toast.success(data.hasUpvoted ? "Upvoted!" : "Upvote removed");
    } catch (error) {
      console.error("Upvote error:", error);
      toast.error(error.message || "Failed to upvote");
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/comments/${comment._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Delete failed with status:", response.status);
        console.error("Error data:", errorData);
        throw new Error(errorData.error || "Failed to delete");
      }

      toast.success("Comment deleted");
      onCommentUpdate();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete comment");
    }
  };

  const handleReplySubmit = () => {
    setIsReplying(false);
    onCommentUpdate();
  };

  const isOwner = currentUser && comment.userId?._id === currentUser.id;
  const isAdmin = currentUser && currentUser.email === "admin@example.com";
  const canDelete = isOwner || isAdmin;
  const hasReplies = comment.replies && comment.replies.length > 0;

  // Format timestamp
  const formatTime = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return commentDate.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      }}
      className={`mb-4 ${indentClass}`}
    >
      <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 ease-out">
        {/* Comment Header */}
        <div className="flex items-start gap-3">
          <img
            src={
              comment.userId?.avatar ||
              "https://ui-avatars.com/api/?background=random"
            }
            alt={comment.userId?.name || "User"}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm md:text-base font-semibold text-gray-900">
                {comment.userId?.name || "Deleted User"}
              </span>
              <span className="text-xs md:text-sm text-gray-500">
                {formatTime(comment.createdAt)}
              </span>
            </div>

            {/* Comment Text */}
            {comment.isDeleted ? (
              <p className="text-xs md:text-sm text-gray-400 italic">
                {comment.deletedBy === "admin"
                  ? "This comment has been deleted by admin"
                  : "This comment has been deleted"}
              </p>
            ) : (
              <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap">
                {comment.text}
              </p>
            )}

            {/* Action Buttons */}
            {!comment.isDeleted && (
              <div className="flex items-center gap-4 mt-3">
                {/* Upvote Button */}
                <button
                  onClick={handleUpvote}
                  disabled={isUpvoting || !currentUser}
                  className={`flex items-center cursor-pointer gap-1 text-xs md:text-sm transition-colors ${
                    isUpvoting
                      ? "text-gray-400"
                      : hasUpvoted
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {/* Animated Arrow - Different animation for upvote vs remove */}
                  <motion.svg
                    key={`arrow-${upvoteAnimationKey}`}
                    initial={{ scale: 1, y: 0, opacity: 1 }}
                    animate={
                      isUpvoteAction
                        ? {
                            // Upvote animation: goes up and fades
                            scale: [1, 1.3, 1],
                            y: [0, -8, 0],
                            opacity: [1, 0, 1],
                          }
                        : {
                            // Remove animation: goes down and shrinks
                            scale: [1, 0.7, 1],
                            y: [0, 8, 0],
                            opacity: [1, 0.3, 1],
                          }
                    }
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                    }}
                    className={`w-4 h-4 md:w-5 md:h-5 transition-all ${
                      hasUpvoted ? "fill-blue-600" : "fill-none"
                    }`}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </motion.svg>

                  {/* Animated Number - Different animation for upvote vs remove */}
                  <motion.span
                    key={`count-${upvoteAnimationKey}`}
                    initial={{ scale: 1, rotate: 0 }}
                    animate={
                      isUpvoteAction
                        ? {
                            // Upvote animation: bouncy and wobbles positively
                            scale: [1, 1.5, 0.95, 1.1, 1],
                            rotate: [0, -10, 10, -5, 0],
                          }
                        : {
                            // Remove animation: shrinks and wobbles opposite direction
                            scale: [1, 0.7, 1.15, 0.95, 1],
                            rotate: [0, 10, -10, 5, 0],
                          }
                    }
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                      times: [0, 0.2, 0.4, 0.6, 1],
                    }}
                    className="font-medium"
                  >
                    {upvotes}
                  </motion.span>
                </button>

                {/* Reply Button */}
                {currentUser && depth < maxDepth && (
                  <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-xs cursor-pointer md:text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Reply
                  </button>
                )}

                {/* Delete Button */}
                {canDelete && (
                  <button
                    onClick={handleDeleteClick}
                    className="text-xs cursor-pointer md:text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                )}

                {/* Collapse Button */}
                {hasReplies && (
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-xs cursor-pointer md:text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {isCollapsed ? "Expand" : "Collapse"} (
                    {comment.replies.length})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reply Form */}
        <AnimatePresence>
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 ml-13"
            >
              <CommentForm
                postId={postId}
                parentCommentId={comment._id}
                onSubmit={handleReplySubmit}
                onCancel={() => setIsReplying(false)}
                placeholder="Write a reply..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nested Replies */}
      <AnimatePresence>
        {hasReplies && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2"
          >
            {comment.replies.map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                postId={postId}
                currentUser={currentUser}
                onCommentUpdate={onCommentUpdate}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Comment"
        message={
          isAdmin && !isOwner
            ? "You are about to delete this comment as an admin. This action cannot be undone and will be marked as deleted by admin."
            : "Are you sure you want to delete this comment? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />
    </motion.div>
  );
}
