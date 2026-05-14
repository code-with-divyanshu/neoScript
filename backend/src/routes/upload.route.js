const express = require("express");
const multer = require("multer");
const requireAuth = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const {
  createBlogController,
  aiSuggestionController,
} = require("../controllers/blog.controller");
const uploadImageController = require("../controllers/upload.controller");

const uploadRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

uploadRouter.post(
  "/content-image",
  requireAuth,
  upload.single("file"),
  uploadImageController,
);

module.exports = uploadRouter;
