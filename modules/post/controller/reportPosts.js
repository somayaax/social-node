const { findService } = require("../../../common/service/findService")
const { pagination } = require("../../../common/service/pagination")
const postModel = require("../../../DB/models/Post")
const reportsModel = require('../../../DB/models/Report')
const userModel = require("../../../DB/models/User")

const reportPost = async (req, res) => {
    try {
        const { id } = req.params
        const { reportComment } = req.body
        const user = await userModel.findById(req.user._id)
        if (user.Deactivated || user.isBlocked) {
            res.status(400).json({ message: 'cannot report' })
        } else {
            const post = await postModel.findById(id)
            if (post) {
                const postReported = await reportsModel.findOne({ reportedBy: req.user._id, postID: post._id })
                if (postReported) {
                    res.status(400).json({ message: "u already reported this post" })
                } else {
                    const report = new reportsModel({ reportComment, reportedBy: req.user._id, postID: post._id })
                    await report.save()
                    res.status(200).json({ message: 'done' })
                }
            } else {
                res.status(400).json({ message: 'post invalid' })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'failed to report post', error })
    }
}

const getReportedPosts = async (req, res) => {
    const populate = [
        { path: 'postID', select: 'title desc createdBy', populate: { path: 'createdBy', select: 'userName email' } },
        { path: 'reportedBy', select: 'userName email' }]
    try {
        const { search, page, size } = req.query
        const { skip, limit } = pagination(page, size)
        const posts = await findService(reportsModel, skip, limit, populate, search, ['reportComment'])
        // const posts = await reportsModel.find({}).skip(skip).limit(limit).populate(populate)
        res.status(200).json({ message: 'done', posts })
    } catch (error) {
        res.status(500).json({ message: 'failed to get posts', error })
    }
}

const blockPost = async (req, res) => {
    try {
        const { id } = req.params
        const reportedPost = await reportsModel.findOne({ postID: id })
        if (reportedPost) {
            const blockedPost = await postModel.findOneAndUpdate({ _id: id, blockedByAdmin: false }, { blockedByAdmin: true })
            if (blockedPost) {
                res.status(200).json({ message: 'done' })
            } else {
                res.status(400).json({ message: 'post already blocked' })
            }
        } else {
            res.status(400).json({ message: 'post is not reported' })
        }
    } catch (error) {
        res.status(500).json({ message: 'failed to block post', error })
    }
}

module.exports = { reportPost, getReportedPosts, blockPost }