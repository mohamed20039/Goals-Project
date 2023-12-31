const asyncHandler = require("express-async-handler");
const Goal = require("../Models/goalModels");
const User = require("../Models/userModel");

// @description Get Goals
// @Route GET /api/goals
// @access private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json(goals);
});

// @description Set Goals
// @Route POST /api/goals
// @access private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please provide a text");
  }

  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  });
  res.status(200).json(goal);
});

// @description Update Goals
// @Route PUT /api/goals/:id
// @access private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error("No goal found");
  }

  // Check if the user exists in the
  if (!req.user) {
    res.status(401);
    throw new Error("No user found");
  }

  // Make sure the login user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User does not match");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});

// @description Delete Goals
// @Route DELETE /api/goals/:id
// @access private
const deleteGoal = asyncHandler(async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      res.status(404);
      return next(new Error("No goal found"));
    }

    // Check if the user exists in the
    if (!req.user) {
      res.status(401);
      throw new Error("No user found");
    }

    // Make sure the login user matches the goal user
    if (goal.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User does not match");
    }

    await goal.deleteOne();

    res.status(200).json({ Deleted: req.params.id });
  } catch (error) {
    return next(error);
  }
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
