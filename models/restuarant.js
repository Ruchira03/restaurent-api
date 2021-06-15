const Joi = require('joi');
const DB = require('../dbConnect')
const schema = Joi.object({
    name: Joi.string().min(5).max(45).required(),
    address : Joi.string().max(255).required(),
    phone : Joi.string().min(7).length(11).pattern(/(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/).required(),
    description : Joi.string().max(255).required(),
});

 const restaurant={};
 
 restaurant.schema = schema;

 module.exports = restaurant;