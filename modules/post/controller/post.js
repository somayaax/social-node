const { findService } = require("../../../common/service/findService");
const { pagination } = require("../../../common/service/pagination");
const postModel = require("../../../DB/models/Post");
const userModel = require("../../../DB/models/User");


const populate = [{ path: 'createdBy', select: 'userName email' }]

const createPost = async (req, res) => {
    try {
        const { title, desc } = req.body;
        if (req.user.Deactivated || req.user.isBlocked) {
            res.status(400).json({ message: "cannot create post" })
        } else {
            const newPost = new postModel({ title, desc, createdBy: req.user._id })
            const savePost = await newPost.save();
            res.status(200).json({ message: "done", post: savePost })
        }
    } catch (error) {
        res.status(500).json({ message: 'failed to create post', error })
    }
}
const editPost = async (req, res) => {
    try {
        const { title, desc } = req.body;
        const { id } = req.params;
        if (req.user.Deactivated || req.user.isBlocked) {
            res.status(400).json({ message: "account deactivated or blocked" })
        } else {
            const updatedPost = await postModel.findOneAndUpdate({ _id: id, createdBy: req.user._id }, { desc, title }, { new: true }).populate(populate)
            if (updatedPost) {
                res.status(200).json({ message: "done", updatedPost })
            } else {
                res.status(400).json({ message: 'post invalid' })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'failed to eidt post', error })
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.Deactivated || req.user.isBlocked) {
            res.status(400).json({ message: "cannot delete post" })
        } else {
            let deletedPost;
            if (req.user.role == 'Admin' || req.user.role == 'superAdmin') {
                deletedPost = await postModel.findByIdAndDelete(id)
            } else if (req.user.role == 'User') {
                deletedPost = await postModel.findOneAndDelete({ _id: id, createdBy: req.user._id })
            }
            if (deletedPost) {
                res.status(200).json({ message: "deleted" })
            } else {
                res.status(400).json({ message: 'post invalid' })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'failed to delete post', error })
    }
}

const getUserPosts = async (req, res) => {
    try {
        const { page, size } = req.query
        const { skip, limit } = pagination(page, size)
        const { id } = req.params;
        let posts
        if (req.user.role == 'User') {
            posts = await postModel.find({ $and: [{ createdBy: req.user._id }, { createdBy: id }] }).populate(populate).skip(skip).limit(limit)
        } else if (req.user.role == 'Admin' || req.user.role == 'superAdmin') {
            posts = await postModel.find({ createdBy: id }).populate(populate).skip(skip).limit(limit)
        }
        if (posts) {
            res.status(200).json({ message: 'done', posts })
        } else {
            res.status(400).json({ message: 'user invalid' })
        }
    } catch (error) {
        res.status(500).json({ message: 'failed to get posts', error })
    }
}

const getValidPosts = async (req, res) => {
    try {
        const users = await userModel.find({ Deactivated: false, isBlocked: false })
        let validPosts = [];
        for (let i = 0; i < users.length; i++) {
            const post = await postModel.find({ blockedByAdmin: false, createdBy: users[i]._id }).populate(populate)
            validPosts.push(...post)
        }
        res.status(200).json({ message: 'done', validPosts })
    } catch (error) {
        res.status(500).json({ message: 'failed to get posts', error })
    }
}

const getAllPosts = async (req, res) => {
    try {
        const { search, page, size } = req.query
        const { skip, limit } = pagination(page, size)
        const posts = await findService(postModel, skip, limit, populate, search, ["title", "desc"])
        // const posts = await postModel.find({}).populate(populate).skip(skip).limit(limit)
        res.status(200).json({ message: 'done', posts })
    } catch (error) {
        res.status(500).json({ message: 'failed to get posts', error })
    }
}
module.exports = {
    createPost,
    editPost,
    deletePost,
    getUserPosts,
    getValidPosts,
    getAllPosts
}