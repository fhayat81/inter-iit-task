import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    text: {
      type: String,
      required: [true, "Please provide comment text"],
      trim: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    parentCommentId: {
      type: Number,
      ref: "Comment",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: String,
      enum: ["user", "admin"],
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Pre-save hook to auto-increment ID based on total comments count
CommentSchema.pre("save", async function (next) {
  if (this.isNew && !this._id) {
    try {
      const Comment = mongoose.model("Comment");
      // Count total documents and add 1 for new ID
      const count = await Comment.countDocuments();
      this._id = count + 1;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Add index for faster queries
CommentSchema.index({ postId: 1, parentCommentId: 1 });

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);
