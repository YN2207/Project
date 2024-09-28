const GoalController = require("../controllers/goal.controller");
const { authenticate } = require("../config/jwt.config");
const { authorize } = require("../config/auth.config");

module.exports = (app) => {
  app.get("/api/test", GoalController.index);
  app.get("/api/goals", GoalController.findAllGoals);
  app.get("/api/goals/:id", GoalController.findOneGoal);
  app.get("/api/user/goals/:userId", GoalController.getAllGoalsByUser);

  app.post("/api/goals", authenticate, GoalController.addNewGoal);
  app.put(
    "/api/goals/:id",
    authenticate,
    authorize,
    GoalController.updateOneGoal
  );
  app.delete(
    "/api/goals/:id",
    authenticate,
    authorize,
    GoalController.deleteOneGoal
  );
  app.put("/api/like/goals/:id", authenticate, GoalController.likeGoal);
  app.put(
    "/api/removelike/goals/:id",
    authenticate,
    GoalController.removeGoalLike
  );
};
