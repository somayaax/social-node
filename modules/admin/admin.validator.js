const Joi = require("joi")
const addAdminValidator = {
    body: Joi.object().required().keys({
        userName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
        cPassword: Joi.string().valid(Joi.ref('password')).required()
    })
}
const signInValidator = {
    body: Joi.object().required().keys({
        email: Joi.string().required().email(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
    })
}
const idValidator ={
    params: Joi.object().required().keys({
        id: Joi.string().required().length(24)
    })
}
const updateValidator = {
    body: Joi.object().required().keys({
        userName: Joi.string(),
        phone: Joi.string().length(11).pattern(new RegExp('^[0-9]+$'))
    })
}

const getAdminsValidator = {
    query:Joi.object().required().keys({
        search:Joi.string(),
        page: Joi.number().min(1),
        size: Joi.number().min(1),
    })
}

module.exports = {
    addAdminValidator,
    signInValidator,
    idValidator,
    updateValidator,
    getAdminsValidator
}