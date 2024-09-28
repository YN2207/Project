const CommentController = require("../controllers/comment.controller");
const { authenticate } = require("../config/jwt.config");
const { authorizeComment } = require("../config/authComment.config");

module.exports = (app) => {
  app.get("/api/comments", authenticate, CommentController.getAllComments);
  app.post(
    "/api/comments/:goalId",
    authenticate,
    CommentController.createComment
  );
  app.delete(
    "/api/comments/:id",
    authenticate,
    authorizeComment,
    CommentController.deleteOneComment
  );
};
