const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: String,
    location: String,
    role: { type: String, default: 'User' },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    Deactivated: { type: Boolean, default: false }
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT))
        next()
    } catch (error) {
        throw new Error(error)
    }
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel