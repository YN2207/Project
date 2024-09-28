const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment is required"],
      minlength: [3, "Your comment must be at least 3 characters long"],
    },
    commentDate: {
      type: Date,
      required: [true, "Comment Date is required"],
    },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: "A goal is required to create a comment",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
