const Joi = require('joi')
const {
    schema
} = require('../models/todo')
Joi.objectId = require('joi-objectid')(Joi)

exports.validateUserAndTask = Joi.object({
    task: Joi.string().min(2).max(100).required().messages({
        "string.min": "Task length must be between 2 and 100 characters.",
        "string.max": "Task length must be between 2 and 100 characters."
    }),
    user: Joi.objectId().message({
        "string.pattern.name": "Something went wrong. clear cookie and try again."
    })
})
exports.validateTask = Joi.object({
    task: Joi.string().min(2).max(100).required().messages({
        "string.min": "Task length must be between 2 and 100 characters.",
        "string.max": "Task length must be between 2 and 100 characters."
    })
})
