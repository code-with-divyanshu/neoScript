const imagekit = require("../services/storage.service");

const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No Image file provided",
      });
    }

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `content-${Date.now()}-${req.file.originalname}`,
      folder: "/neoScript/blog/blog_images",
    });

    res.status(200).json({
      message: "File Uploaded Successfully",
      url: result.url,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Image Upload Failed",
      error: error.message,
    });
  }
};

module.exports = uploadImageController;
