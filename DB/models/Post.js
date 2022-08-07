const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title: String,
    desc: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    blockedByAdmin: { type: Boolean, default: false }
}, {
    timestamps: true
})
const postModel = mongoose.model('Post', postSchema)
module.exports = postModel 