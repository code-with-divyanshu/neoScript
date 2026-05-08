const express = require("express");
const multer = require("multer");
const requireAuth = require("../middlewares/auth.middleware");
const {
  getUserProfileController,
  updateUserRoleController,
  getAllUsersProfileController,
  updateUserProfileController,
} = require("../controllers/user.controller");
const allowRoles = require("../middlewares/role.middleware");

const userRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

userRouter.get("/me", requireAuth, getUserProfileController);
userRouter.put(
  "/update-profile",
  requireAuth,
  upload.single("profilePicture"),
  updateUserProfileController,
);

userRouter.get(
  "/admin/users",
  requireAuth,
  allowRoles("admin"),
  getAllUsersProfileController,
);
userRouter.put(
  "/admin/users/:userId/role",
  requireAuth,
  allowRoles("admin"),
  updateUserRoleController,
);

module.exports = userRouter;
