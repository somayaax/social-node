const jwt = require("jsonwebtoken")
const adminModel = require("../../../DB/models/Admin")
const bcrypt = require('bcrypt')
const CryptoJS = require('crypto-js')
const { sendEmail } = require('../../../common/email')
const { pagination } = require("../../../common/service/pagination")
const { findService } = require("../../../common/service/findService")

const addAdmin = async (req, res) => {
    try {
        const { userName, email, password } = req.body
        const emailExists = await adminModel.findOne({ email })
        if (emailExists) {
            res.status(400).json({ message: 'email already exists' })
        } else {
            const newadmin = new adminModel({ userName, email, password })
            const admin = await newadmin.save();
            const token = jwt.sign({ id: admin._id }, process.env.TOKEN_KEY, { expiresIn: 60 })
            const refreshToken = jwt.sign({ id: admin._id }, process.env.TOKEN_KEY)
            sendEmail(admin.email,
                `<p>account created by ${req.user.email}</p>
                <a href = '${req.protocol}://${req.headers.host}/admin/confirm/${token}'>confirm email</a><br>
                <a href = '${req.protocol}://${req.headers.host}/admin/resend/${refreshToken}'>resend email</a>`);
            res.status(201).json({ message: "done", admin })
        }
    } catch (error) {
        res.status(500).json({ message: 'failed to add admin', error })
    }
}

const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            res.status(400).json({ message: "token error" })
        } else {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            const user = await adminModel.findOneAndUpdate({ _id: decoded.id, isVerified: false }, { isVerified: true }, { new: true })
            if (user) {
                res.status(200).json({ message: 'confirmed' })
            } else {
                res.status(400).json({ message: "invalid link" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "confirmation error", error })
    }
}

const resendEmail = async (req, res) => {
    try {
        const { token } = req.params
        if (!token) {
            res.status(400).json({ message: "token error" })
        } else {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            const user = await adminModel.findOne({ _id: decoded.id, isVerified: false })
            if (user) {
                const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, { expiresIn: 60 })
                const refreshToken = jwt.sign({ id: user._id }, process.env.TOKEN_KEY)
                sendEmail(user.email,
                    `<a href = '${req.protocol}://${req.headers.host}/confirm/${token}'>confirm email</a><br>
                    <a href = '${req.protocol}://${req.headers.host}/resend/${refreshToken}'>resend email</a>`);
                res.status(201).json({ message: "done" })
            } else {
                res.status(400).json({ message: "link invalid" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "server err", error })
    }
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminModel.findOne({ email })
        if (admin) {
            if (admin.isVerified) {
                const passwordMatch = await bcrypt.compare(password, admin.password)
                if (passwordMatch) {
                    const token = jwt.sign({ id: admin._id }, process.env.TOKEN_KEY, { expiresIn: '2h' })
                    res.status(200).json({ message: "done", token })
                } else {
                    res.status(400).json({ message: "password incorrect" })
                }
            } else {
                res.status(400).json({ message: "verify your email first" })
            }
        } else {
            res.status(400).json({ message: "email incorrect" })
        }
    } catch (error) {
        res.status(500).json({ message: "sign in err", error })
    }
}

const getAdminsList = async (req, res) => {
    try {
        const { search, page, size } = req.query
        const { skip, limit } = pagination(page, size)
        let populate;
        const admins = await findService(adminModel, skip, limit,populate,search,['userName','email'])
        res.status(200).json({ message: 'done', admins })
    } catch (error) {
        res.status(500).json({ message: "failed to get admins", error })
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const admin = await adminModel.findOneAndDelete({ _id: id, role: 'Admin' })
        if (admin) {
            res.status(200).json({ message: 'done' })
        } else {
            res.status(400).json({ message: 'user invalid' })
        }
    } catch (error) {
        res.status(500).json({ message: "failed to delete admin", error })
    }
}

const editAdminProfile = async (req, res) => {
    try {
        let { userName, phone } = req.body;
        if (phone) {
            phone = CryptoJS.AES.encrypt(phone, process.env.CRYPTO_KEY).toString();
        }
        const updatedAdmin = await adminModel.findByIdAndUpdate(req.user._id, { userName, phone })
        if (updatedAdmin) {
            res.status(200).json({ message: 'done', updatedAdmin })
        } else {
            res.status(400).json({ message: 'user invalid' })
        }
    } catch (error) {
        res.status(500).json({ message: "failed to edit profile", error })
    }
}
module.exports = { addAdmin, confirmEmail, resendEmail, signIn, getAdminsList, deleteAdmin, editAdminProfile }