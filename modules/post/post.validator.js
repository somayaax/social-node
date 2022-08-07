const Joi = require('joi');

const createPostValidator = {
    body: Joi.object().required().keys({
        title: Joi.string(),
        desc: Joi.string().required()
    })
}

const editPostValidator ={
    body: Joi.object().required().keys({
        title: Joi.string(),
        desc: Joi.string()
    }),
    params: Joi.object().required().keys({
        id: Joi.string().length(24).required()
    })
}
const IDValidator = {
    params: Joi.object().required().keys({
        id: Joi.string().length(24).required()
    })
}

const getPostsValidator = {
    query:Joi.object().required().keys({
        search:Joi.string(),
        page: Joi.number().min(1),
        size: Joi.number().min(1),
    })
}

module.exports = { createPostValidator,editPostValidator ,IDValidator,getPostsValidator}