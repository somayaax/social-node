const mongoose = require('mongoose')
const reportedPosts = new mongoose.Schema({
    postID: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reportComment: { type: String, required: true }
}, {
    timestamps: true
})
const reportsModel = mongoose.model('Report', reportedPosts)
module.exports = reportsModel