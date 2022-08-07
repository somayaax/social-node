const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: String,
    role: { type: String, enum: ["Admin", "superAdmin"], default: 'Admin' },
    isVerified: { type: Boolean, default: false },
}, {
    timestamps: true
})

adminSchema.pre('save', async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT))
        next()
    } catch (error) {
        throw new Error(error)
    }
})

const adminModel = mongoose.model('Admin', adminSchema)

module.exports = adminModel