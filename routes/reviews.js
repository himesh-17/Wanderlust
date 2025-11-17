const express = require('express');
const router = express.Router({strict : true , caseSensitive : true , mergeParams : true});
const Review = require("../Models/review");
const { findById } = require('../Models/listing');
const Listing =require("../Models/listing");
const {reviewSchema} = require("../schema");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require('../utils/ExpressError.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/controllers.review.js");

// Add new review ------------>

router.post("/listings/:id/reviews", 
    isLoggedIn,
    validateReview , 
    wrapAsync(reviewController.addReview)
);

// destroy Route ------------->

router.delete("/listings/:id/review/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router ; 

 