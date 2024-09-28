const Comment = require("../models/comment.model");
const Goal = require("../models/goal.model");
const jwt = require("jsonwebtoken");

const createComment = async (req, res) => {
  const { body, params } = req;
  let newComment = new Comment(body);
  let goalQuery;
  newComment.goal = params.goalId;
  const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
  newComment.user_id = decodedJwt.payload._id;

  try {
    newComment = await newComment.save();
    goalQuery = await Goal.findByIdAndUpdate(
      { _id: params.goalId },
      { $push: { comments: { $each: [newComment._id], $position: 0 } } },
      { new: true, useFindAndModify: true }
    );
    res.json({ newComment, goalQuery });
  } catch (err) {
    res.status(400).json(err);
  }
};

const getAllComments = (req, res) => {
  Comment.find({})
    .sort({ commentDate: "descending" })
    .populate("user_id", "firstName email -_id")

    .then((allComments) => {
      console.log(allComments);
      res.json(allComments);
    })
    .catch((err) => {
      console.log("error in getAll: " + err);
      res.json(err);
    });
};

const deleteOneComment = (req, res) => {
  console.log(req.params.id);
  Comment.findByIdAndRemove(req.params.id)
    .then((removedComment) => {
      console.log("Comment removed");
      res.json(removedComment);
    })
    .catch((err) => {
      console.log("error in delete one comment: " + err);
      res.json(err);
    });
};

module.exports = {
  getAllComments,
  createComment,
  deleteOneComment,
};
