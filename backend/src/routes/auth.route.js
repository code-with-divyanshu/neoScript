const express = require("express");
const {
  signupController,
  loginController,
  logoutController,
  adminSignupController,
} = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/admin/signup", adminSignupController);
authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);

module.exports = authRouter;
