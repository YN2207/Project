const Goal = require("../models/goal.model");
const jwt = require("jsonwebtoken");

const index = (req, res) => {
  res.json({
    message: "Hello World",
  });
};

const addNewGoal = (req, res) => {
  console.log(req.body);
  const goal = new Goal(req.body);
  const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
  goal.user_id = decodedJwt.payload._id;

  goal
    .save()
    .then((newGoal) => {
      console.log(newGoal);
      res.json(newGoal);
    })
    .catch((err) => {
      console.log("error in create goal: " + err);
      res.status(400).json(err);
    });
};

const findAllGoals = (req, res) => {
  Goal.find({})
    .populate("user_id", "firstName _id")
    .sort({ likesLength: "descending" })
    .then((allGoals) => {
      console.log("Show all goals section");
      res.json(allGoals);
    })
    .catch((err) => {
      console.log("In find all goals error section");
      res.status(400).json({
        message: "Something went wrong in find all goals",
        error: err,
      });
    });
};

const getAllGoalsByUser = (req, res) => {
  Goal.find({ user_id: req.params.userId })
    .populate("user_id", "firstName _id email")
    .populate({
      path: "comments",
      options: { limit: 2, sort: { createdAt: -1 } },
      populate: { path: "user_id" },
    })
    .sort({ likesLength: "descending" })
    .then((allUserGoals) => {
      console.log("success - returning all user goals");
      res.json(allUserGoals);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(400)
        .json("something went wrong in getting goals for user:" + err);
    });
};

const findOneGoal = (req, res) => {
  console.log(req.params.id);
  Goal.findOne({ _id: req.params.id })
    .populate("user_id", "_id firstName email")
    .populate({
      path: "comments",
      populate: { path: "user_id" },
    })
    .then((oneSingleGoal) => {
      console.log("Success - found one goal section");
      res.status(200).json(oneSingleGoal);
    })
    .catch((err) => {
      console.log("Error - could not find one goal section");
      res.status(400).json(err);
    });
};

const updateOneGoal = (req, res) => {

  Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedGoal) => {
      console.log("In goal updated section");
      res.status(200).json(updatedGoal);
    })
    .catch((err) => {
      console.log("error in the update one goal section: " + err);
      res.status(400).json(err);
    });
};

const deleteOneGoal = (req, res) => {
  Goal.deleteOne({ _id: req.params.id })
    .then((deleteConfirmation) => {
      console.log("In delete goal section");
      res.status(200).json(deleteConfirmation);
    })
    .catch((err) => {
      console.log("Error in the delete goal section" + err);
      res
        .status(400)
        .json({ message: "Something went wrong in delete goal", error: err });
    });
};

const likeGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
    if (
      goal.likes.filter((like) => like._id.toString() == decodedJwt.payload._id)
        .length > 0
    ) {
      return res
        .status(400)
        .json({ msg: "Goal has already been liked by user" });
    }

    console.log(req.params.id);

    Goal.findByIdAndUpdate(
      req.params.id,
      {
        $push: { likes: decodedJwt.payload._id },
        $inc: { likesLength: 1 },
      },
      {
        new: true,
        useFindAndModify: false,
      }
    )
      .populate("likes")
      .then((updatedGoal) => {
        console.log(updatedGoal);
        res.json(updatedGoal);
      });
  } catch (err) {
    console.log("error in update likes goal: " + err);
    res.json(err);
  }
};
const removeGoalLike = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
    if (
      goal.likes.filter((like) => like._id.toString() == decodedJwt.payload._id)
        .length === 0
    ) {
      console.log("in section where no like was found");
      return res
        .status(400)
        .json({ msg: "Goal has not yet been liked by user" });
    }

    Goal.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: decodedJwt.payload._id },
        $inc: { likesLength: -1 },
      },
      {
        new: true,
        useFindAndModify: false,
      }
    )
      .populate("likes", "_id")
      .then((updatedGoal) => {
        console.log(updatedGoal);
        res.json(updatedGoal);
      });
  } catch (err) {
    console.log("error in update likes skiff: " + err);
    res.json({ msg: "Error in the catch" });
  }
};

module.exports = {
  index,
  addNewGoal,
  findAllGoals,
  getAllGoalsByUser,
  findOneGoal,
  updateOneGoal,
  deleteOneGoal,
  likeGoal,
  removeGoalLike,
};
