const express = require("express");
const {
  signupController,
  loginController,
  logoutController,
  adminSignupController,
} = require("../controllers/auth.controller");
const {
  validateSignup,
  validateLogin,
} = require("../middlewares/validation.middleware");

const authRouter = express.Router();

authRouter.post("/admin/signup", validateSignup, adminSignupController);
authRouter.post("/signup", validateSignup, signupController);
authRouter.post("/login", validateLogin, loginController);
authRouter.post("/logout", logoutController);

module.exports = authRouter;
