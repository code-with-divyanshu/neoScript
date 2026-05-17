const express = require("express");
const multer = require("multer");
const requireAuth = require("../middlewares/auth.middleware");
const {
  getUserProfileController,
  updateUserRoleController,
  changeUserPasswordController,
  getAllUsersProfileController,
  updateUserProfileController,
  getLikedPostsController,
  getUserDashboardController,
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
userRouter.post("/change-password", requireAuth, changeUserPasswordController);

userRouter.get("/liked-posts", requireAuth, getLikedPostsController);

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

userRouter.get(
  "/dashboard",
  requireAuth,
  allowRoles("author", "admin"),
  getUserDashboardController,
);

module.exports = userRouter;
