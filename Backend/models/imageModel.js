const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    filePath: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Image', imageSchema);
