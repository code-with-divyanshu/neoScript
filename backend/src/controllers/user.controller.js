const userModel = require("../models/user.model");
const imagekit = require("../services/storage.service");

const getUserProfileController = (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUserProfileController = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const updateData = {
      name,
      bio,
    };

    if (req.file) {
      const uploadImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `profile_${req.user._id}_${Date.now()}`,
        folder: "/neoScript/profiles",
      });
      updateData.profilePicture = uploadImage.url;
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true,
      })
      .select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const changeUserPasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res
        .status(400)
        .json({ message: "All password fields are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters long.",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const user = await userModel.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllUsersProfileController = async (req, res) => {
  try {
    const users = await userModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All user profiles fetched successfully",
      users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUserRoleController = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const allowedRoles = ["reader", "author", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Allowed roles are reader, author, admin.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.role = role;
    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfileController,
  updateUserProfileController,
  getAllUsersProfileController,
  updateUserRoleController,
};
