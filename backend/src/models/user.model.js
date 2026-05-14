const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    role: {
      type: String,
      enum: ["reader", "author", "admin"],
      default: "reader",
    },
    bio: {
      type: String,
      maxLength: 200,
    },
    termsAccepted: { type: Boolean, default: false, required: true },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  { timestamps: true },
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
