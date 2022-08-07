const Joi = require("joi")

const signUpValidator = {
    body: Joi.object().required().keys({
        userName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
        cPassword: Joi.string().valid(Joi.ref('password')).required(),
        phone: Joi.string().length(11).pattern(new RegExp('^[0-9]+$')).required(),
        location: Joi.string()
    })
}

const signInValidator = {
    body: Joi.object().required().keys({
        email: Joi.string().required().email(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    })
}
const updateProfileValidator = {
    body: Joi.object().required().keys({
        userName: Joi.string(),
        phone: Joi.string().length(11).pattern(new RegExp('^[0-9]+$')),
        location: Joi.string()
    })
}
const updatePasswordValidator = {
    body: Joi.object().required().keys({
        oldPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
        newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
        cNewPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    })
}
const forgetPasswordValidator = {
    body: Joi.object().required().keys({
        email: Joi.string().required().email(),
    })
}
const resetPasswordValidator = {
    body: Joi.object().required().keys({
        newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
        cNewPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    })
}
const blockValidator = {
    params: Joi.object().required().keys({
        id: Joi.string().length(24).required()
    })
}
const deactivateValidator = {
    body: Joi.object().required().keys({
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    })
}

module.exports = {
    signUpValidator,
    signInValidator,
    updateProfileValidator,
    updatePasswordValidator,
    forgetPasswordValidator,
    resetPasswordValidator,
    blockValidator,
    deactivateValidator
}