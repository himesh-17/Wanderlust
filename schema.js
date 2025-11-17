const Joi = require('joi');
const ExpressError = require("./utils/ExpressError");

// Joi formate ---------->

// for the Listing validation 

const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(500), // match mongoose
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.string().allow("", null),
    category: Joi.string()
        .valid(
            "trending",
            "stays",
            "hotels",
            "adventure",
            "beach",
            "urban",
            "nature",
            "lake",
            "camp",
            "private",
            "arctic",
            "global"
        )
        .required(),
}).required();


// For the reviews validation 

const reviewSchema = Joi.object({
    rating : Joi.number().min(0).max(5).required(),
    comment : Joi.string().required(),
}).required();

// As the middleware ------>


module.exports = {listingSchema,reviewSchema};

