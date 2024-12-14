const express = require("express");
const multer = require("multer");
const path = require("path");
const Image = require("../models/imageModel");

const router = express.Router();

// Configure multer storage and file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/jpg",
    "image/webp",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage, fileFilter });

// Upload route
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { description } = req.body;
    const filePath = req.file.path.replace("\\", "/");
    const newImage = new Image({ description, imageUrl: filePath });

    const io = req.app.get("socketio");
    io.emit("newVideo", { description: newImage.description, imageUrl: newImage.imageUrl });

    await newImage.save();
    res.status(200).json({
      message: "Image uploaded successfully!",
      image: newImage,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});
router.get("/images", async (req, res) =>{
    try {
        const images = await Image.find()
        res.status(200).json(images)
    } catch (error) {
        console.error("Failed to fetch the image", error)
        res.status(500).json({ message: "Image not found"})
    }
})
module.exports = router;
