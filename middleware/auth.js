const jwt = require("jsonwebtoken");
const adminModel = require("../DB/models/Admin");
const userModel = require("../DB/models/User");

exports.auth = (data) => {
    return async (req, res, next) => {
        try {
            const userToken = req.headers['authorization']
            if (!userToken || userToken == null || !userToken.startsWith('Bearer')) {
                res.status(400).json({ message: "token error" })
            } else {
                const token = userToken.replace('Bearer ', '');
                const decoded = jwt.verify(token, process.env.TOKEN_KEY)
                const user = await userModel.findById(decoded.id).select('-password')
                const admin = await adminModel.findById(decoded.id).select('-password')
                if (user) {
                    if (data.includes(user.role)) {
                        req.user = user;
                        next()
                    } else {
                        res.status(401).json({ message: "unauthorized access" })
                    }
                }
                else if (admin) {
                    if (data.includes(admin.role)) {
                        req.user = admin;
                        next()
                    } else {
                        res.status(401).json({ message: "unauthorized access" })
                    }
                }
                else {
                    res.status(400).json({ message: "user invalid" })
                }
            }
        } catch (error) {
            res.status(500).json({ message: "server error", error })
        }
    }
}

exports.roles = Object.freeze({
    User: 'User',
    Admin: 'Admin',
    SuperAdmin: 'superAdmin'
})