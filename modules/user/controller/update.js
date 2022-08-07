const CryptoJS = require("crypto-js")
const userModel = require('../../../DB/models/User')
const bcrypt = require('bcrypt')

const updateProfile = async (req, res) => {
    try {
        let { userName, location, phone } = req.body
        if (phone) {
            phone = CryptoJS.AES.encrypt(phone, process.env.CRYPTO_KEY).toString();
        }
        const updatedUser = await userModel.findOneAndUpdate({ _id: req.user._id, Deactivated: false }, { userName, location, phone }, { new: true })
        if (updatedUser) {
            res.status(200).json({ message: "done", updatedUser })
        } else {
            res.status(400).json({ message: "invalid user" })
        }
    } catch (error) {
        res.status(500).json({ message: "failed to update profile", error })
    }
}

const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await userModel.findById(req.user._id)
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (passwordMatch) {
            user.password = newPassword;
            const saveUser = await user.save()
            res.status(200).json({ message: "done", user: saveUser })
        } else {
            res.status(400).json({ message: "old password incorrect" })
        }
    } catch (error) {
        res.status(500).json({ message: "failed to update password", error })
    }
}

const blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findOneAndUpdate({ _id: id, isBlocked: false }, { isBlocked: true }, { new: true })
        if (user) {
            res.status(200).json({ message: "user blocked", user })
        } else {
            res.status(400).json({ message: "user invalid" })
        }
    } catch (error) {
        res.status(500).json({ message: "failed to block user", error })
    }
}
const deactivate = async (req, res) => {
    try {
        const { password } = req.body
        const user = await userModel.findById(req.user._id)
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            const updateUser = await userModel.updateOne({ _id: req.user._id, Deactivated: false }, { Deactivated: true })
            if (updateUser) {
                res.status(200).json({ message: "account deactivated" })
            } else {
                res.status(400).json({ message: "already deactivated" })
            }
        } else {
            res.status(400).json({ message: "password incorrect" })
        }
    } catch (error) {
        res.status(500).json({ message: "failed to deactivate account", error })
    }
}
module.exports = { updateProfile, updatePassword,blockUser, deactivate }