const Listing = require("./Models/listing");
const Error = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schema");
const Review = require("./Models/review");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        // redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be Logged-In!");
       return res.redirect("/api/login");
    }
    next();
};

module.exports.saveRedirect = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    const{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not Owned this!");
        return res.redirect(`/api/listings/${id}`);
    }
    next();
};

module.exports.validateError = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404 , error.details[0].message)
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
     const {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400 , error.details[0].message)
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next)=>{
    const{id ,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not author of this Review!");
        return res.redirect(`/api/listings/${id}`);
    }
    next();
};