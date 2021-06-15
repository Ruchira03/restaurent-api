const Joi = require('joi');

const schema = Joi.object({
    email: Joi.string().min(5).max(45).required().email(),
    name: Joi.string().min(5).max(45).required(),
    password : Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,255}$/).required(),
});

module.exports = schema;