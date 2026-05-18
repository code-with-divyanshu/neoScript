const blogModel = require("../models/blog.model");
const userModel = require("../models/user.model");
const {
  generateSummary,
  getWritingSuggestions,
} = require("../services/ai.service");
const imagekit = require("../services/storage.service");
const slugify = require("slugify");

const createBlogController = async (req, res) => {
  try {
    const { title, description, content, category, status } = req.body;

    if (!title || !description || !content || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingBlog = await blogModel.findOne({ title });
    if (existingBlog) {
      return res.status(400).json({
        message: "Title already exists. Duplicate titles are not allowed.",
      });
    }

    if (!req.file)
      return res.status(400).json({ message: "Featured image is required" });

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `blog_${Date.now()}_${req.file.originalname}`,
      folder: "/neoScript/blog/featureImage",
    });

    const normalizedStatus = status === "published" ? "published" : "draft";

    let summary = "";
    if (normalizedStatus === "published" && content?.trim()) {
      summary = await generateSummary(content);
    }

    const slug = slugify(title, { lower: true, strict: true });

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const newBlog = await blogModel.create({
      title,
      description,
      content,
      featureImage: result.url,
      category: category || "uncategorized",
      slug,
      aiSummary: summary,
      status: normalizedStatus,
      userId: req.user.id,
      author: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message:
        normalizedStatus === "draft"
          ? "Draft saved successfully"
          : "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const aiSuggestionController = async (req, res) => {
  try {
    const { partialContent } = req.body;

    if (!partialContent) {
      return res.status(400).json({ message: "Partial content is required" });
    }

    const suggestion = await getWritingSuggestions(partialContent);

    return res.status(200).json({
      message: "AI Suggestion Generated Successfully",
      suggestion,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "AI Service temporarily unavailable" });
  }
};

const getBlogsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { category, search, status } = req.query;

    const skip = (page - 1) * limit;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    } else {
      query.status = "published";
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const [blogs, totalBlogs] = await Promise.all([
      blogModel
        .find(query)
        .populate("author", "name email  profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      blogModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalBlogs / limit);

    return res.status(200).json({
      success: true,
      count: blogs.length,
      totalBlogs,
      totalPages,
      currentPage: page,
      blogs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBlogDetailsController = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blogModel
      .findById(id)
      .populate("author", "name email profilePicture bio");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyBlogsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const { status, search } = req.query;

    const skip = (page - 1) * limit;

    let query = {
      author: req.user.id,
    };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const [blogs, totalBlogs] = await Promise.all([
      blogModel
        .find(query)
        .populate("author", "name email profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      blogModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalBlogs / limit);

    return res.status(200).json({
      success: true,
      count: blogs.length,
      totalBlogs,
      totalPages,
      currentPage: page,
      blogs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserBlogsController = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const { search, category } = req.query;

    const skip = (page - 1) * limit;

    const query = {
      author: userId,
      status: "published",
    };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const [blogs, totalBlogs] = await Promise.all([
      blogModel
        .find(query)
        .populate("author", "name email profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      blogModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalBlogs / limit);

    return res.status(200).json({
      success: true,
      count: blogs.length,
      totalBlogs,
      totalPages,
      currentPage: page,
      blogs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, category, status } = req.body;

    const blog = await blogModel.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this blog" });
    }

    if (title) {
      const existingBlog = await blogModel.findOne({
        title,
        _id: { $ne: id }, // Exclude this current blog from the duplicate search
      });

      if (existingBlog) {
        return res.status(400).json({
          message: "Title already exists. Duplicate titles are not allowed.",
        });
      }
    }

    let updatedImage = blog.featureImage;

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `blog_${Date.now()}_${req.file.originalname}`,
        folder: "/neoScript/blog/featureImage",
      });

      updatedImage = result.url;
    }

    const updatedSlug = title
      ? slugify(title, { lower: true, strict: true })
      : blog.slug;

    let summary = blog.aiSummary;
    const normalizedStatus = status === "published" ? "published" : blog.status;
    const updatedContent = content !== undefined ? content : blog.content;

    if (normalizedStatus === "published" && updatedContent?.trim()) {
      summary = await generateSummary(updatedContent);
    }

    const updatedBlog = await blogModel.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(content && { content }),
        ...(category && { category }),
        featureImage: updatedImage,
        slug: updatedSlug,
        aiSummary: summary,
        status: normalizedStatus,
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteBlogController = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blogModel.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const isOwner = blog.author.equals(req.user.id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this blog" });
    }

    await blogModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const toggleLikeBlogController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const blog = await blogModel.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyLiked = blog.likes.some(
      (like) => like.toString() === req.user.id.toString(),
    );

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (like) => like.toString() !== req.user.id.toString(),
      );

      user.likedPosts = user.likedPosts.filter(
        (postId) => postId.toString() !== blog._id.toString(),
      );

      await blog.save();
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Blog unliked successfully",
        liked: false,
        totalLikes: blog.likes.length,
      });
    }

    blog.likes.push(req.user.id);
    user.likedPosts.push(blog._id);

    await blog.save();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Blog liked successfully",
      liked: true,
      totalLikes: blog.likes.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBlogController,
  aiSuggestionController,
  getBlogsController,
  getBlogDetailsController,
  getMyBlogsController,
  getUserBlogsController,
  updateBlogController,
  deleteBlogController,
  toggleLikeBlogController,
};
