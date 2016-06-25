/**
 * @Author: Mehedi Hasan
 * @E-mail: mhm2k9@gmail.com
 * Script: stories.js
 */

var mongoose = require("mongoose"),
    Story = new mongoose.Schema({
            title: { type: String, required: true, index: { unique: true } },
            story: { type: String, required: true },
            image: { type: String },
            created: { type: Date, default: Date.now },
            updated: { type: Date, default: Date.now },
            author: { type: String, required: true }
    });

module.exports = mongoose.model('stories', Story);
