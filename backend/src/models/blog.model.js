const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    featureImage: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    aiSummary: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
