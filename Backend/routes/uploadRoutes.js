const express = require('express');
const multer = require('multer');
const path = require('path');
const Image = require('../models/imageModel');

const router = express.Router();

// Configure multer storage and file filter
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file format'), false);
    }
};

const upload = multer({ storage, fileFilter });

// Upload route
router.post('/', upload.single('file'), async (req, res) => {
    try {
        console.log(req.file); // Log the file object to check if it is being received

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { description } = req.body;
        const newImage = new Image({
            filePath: req.file.path,
            description
        });

        await newImage.save();
        res.status(200).json({ message: 'Image uploaded successfully!', image: newImage });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

module.exports = router;
