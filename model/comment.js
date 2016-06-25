/**
 * @Author: Mehedi Hasan
 * @E-mail: mhm2k9@gmail.com
 * Script: comment.js
 */

var mongoose = require("mongoose"),
    Comment = new mongoose.Schema({
            story_title: { type: String, required: true },
            username: { type: String, required: true },
            email: { type: String, required: true },
            comment: { type: String, required: true },
            created: { type: Date, default: Date.now },
            updated: { type: Date, default: Date.now }
    });

module.exports = mongoose.model('comment', Comment);