const express = require("express");
const multer = require("multer");
const requireAuth = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const {
  createBlogController,
  aiSuggestionController,
  getBlogsController,
  getMyBlogsController,
  getUserBlogsController,
  getBlogDetailsController,
  updateBlogController,
  deleteBlogController,
  toggleLikeBlogController,
} = require("../controllers/blog.controller");
const { get } = require("mongoose");

const blogRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

blogRouter.get("/", getBlogsController);
blogRouter.get("/my-blogs", requireAuth, getMyBlogsController);
blogRouter.get("/user/:userId", getUserBlogsController);
blogRouter.get("/:id", getBlogDetailsController);

blogRouter.post(
  "/create",
  requireAuth,
  allowRoles("author", "admin"),
  upload.single("featureImage"),
  createBlogController,
);
blogRouter.post(
  "/ai-suggestion",
  requireAuth,
  allowRoles("author", "admin"),
  aiSuggestionController,
);
blogRouter.put(
  "/edit/:id",
  requireAuth,
  allowRoles("author", "admin"),
  upload.single("featureImage"),
  updateBlogController,
);

blogRouter.delete(
  "/delete/:id",
  requireAuth,
  allowRoles("author", "admin"),
  deleteBlogController,
);

blogRouter.patch("/like/:id", requireAuth, toggleLikeBlogController);

module.exports = blogRouter;
