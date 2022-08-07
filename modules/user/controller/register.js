const userModel = require('../../../DB/models/User')
const bcrypt = require('bcrypt')
const CryptoJS = require("crypto-js")
const { sendEmail } = require('../../../common/email')
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
    try {
        let { userName, email, password, phone, location } = req.body
        const emailExists = await userModel.findOne({ email })
        if (emailExists) {
            res.status(400).json({ message: "email already exists" })
        } else {
            if (phone) {
                phone = CryptoJS.AES.encrypt(phone, process.env.CRYPTO_KEY).toString();
            }
            const user = new userModel({ userName, email, password, phone, location })
            const saveUser = await user.save();
            const token = jwt.sign({ id: saveUser._id }, process.env.TOKEN_KEY, { expiresIn: 60 })
            const refreshToken = jwt.sign({ id: saveUser._id }, process.env.TOKEN_KEY)
            sendEmail(saveUser.email,
                `<a href = '${req.protocol}://${req.headers.host}/confirm/${token}'>confirm email</a><br>
                <a href = '${req.protocol}://${req.headers.host}/resend/${refreshToken}'>resend email</a>`);
            res.status(201).json({ message: "done", user: saveUser })
        }
    } catch (error) {
        res.status(500).json({ message: "signup error", error })
    }
}

const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            res.status(400).json({ message: "token error" })
        } else {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            const user = await userModel.findOneAndUpdate({ _id: decoded.id, isVerified: false }, { isVerified: true }, { new: true })
            if (user) {
                res.status(200).json({ message: 'confirmed' })
            } else {
                res.status(400).json({ message: "invalid link" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "confirmation error", error: error.toString() })
    }
}

const resendEmail = async (req, res) => {
    try {
        const { token } = req.params
        if (!token) {
            res.status(400).json({ message: "token error" })
        } else {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            const user = await userModel.findOne({ _id: decoded.id, isVerified: false })
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
        const user = await userModel.findOne({ email, isBlocked: false })
        if (user) {
            if (user.isVerified) {
                const passwordMatch = await bcrypt.compare(password, user.password)
                if (passwordMatch) {
                    const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, { expiresIn: '2h' })
                    res.status(200).json({ message: "done", token })
                } else {
                    res.status(400).json({ message: "password incorrect" })
                }
            } else {
                res.status(400).json({ message: "verify your email first" })
            }
        } else {
            res.status(400).json({ message: "email incorrect or user blocked" })
        }
    } catch (error) {
        res.status(500).json({ message: "sign in err", error })
    }
}

module.exports = {signUp,confirmEmail,resendEmail, signIn}