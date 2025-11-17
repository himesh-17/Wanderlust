const Listing = require("../Models/listing");
const Review = require("../Models/review");

module.exports.addReview = async (req,res)=>{
    console.log(req.body);
    const{rating,comment} = req.body;
        const review = {
            rating : rating,
            comment : comment
        }
    const {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(review);
    newReview.author = req.user._id;
    console.log(newReview ,".........." , req.user);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Created!");
    res.redirect(`/api/listings/${id}`);
};


module.exports.deleteReview = async(req,res)=>{
    const{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull :{reviews : reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted!");
    res.redirect(`/api/listings/${id}`);
};