const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

const signupController = async (req, res) => {
  try {
    const { name, email, password, termsAccepted } = req.body;

    const existingEmail = await userModel.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(409).json({
        message: "This email is already Exist , Try Again with another email",
      });
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        message: "Password must be a string and at least 8 characters long",
      });
    }

    if (!termsAccepted) {
      return res.status(400).json({ message: "You must accept the terms." });
    }

    const user = await userModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      termsAccepted,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("authToken", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({
      message: "User Created Successfully",
      user: userResponse,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "User Not Found - Login Again",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Password - Unauthorize, Try Again !",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("authToken", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(200).json({
      message: "User Logged In Successfully",
      user: userResponse,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logoutController = (req, res) => {
  try {
    res.clearCookie("authToken");
    res.status(200).json({ message: "User Logged Out Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signupController,
  loginController,
  logoutController,
};
