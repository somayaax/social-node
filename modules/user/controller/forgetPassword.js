const userModel = require("../../../DB/models/User");
const jwt = require("jsonwebtoken");
const { sendEmail } = require('../../../common/email')

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userModel.findOne({ email });
        if (user) {
            const resetToken = jwt.sign({ id: user._id }, process.env.TOKEN_RESET, { expiresIn: '5m' })
            sendEmail(user.email,
                `<p>link to reset password</p>
                ${req.protocol}://${req.headers.host}/user/resetPassword/n${resetToken}`)
            res.status(200).json({ message: 'email sent' })
        } else {
            res.status(400).json({ message: "email incorrect" })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        if (!token) {
            res.status(400).json({ message: 'token error' })
        } else {
            const decoded = jwt.verify(token, process.env.TOKEN_RESET);
            const user = await userModel.findOne({ _id: decoded.id })
            if (user) {
                user.password = newPassword;
                const saveUser = await user.save()
                sendEmail(user.email, 'your password has been reset')
                res.status(200).json({ message: "reset done", user: saveUser })
            } else {
                res.status(400).json({ message: 'user invalid' })
            }
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}

module.exports = { forgetPassword, resetPassword }