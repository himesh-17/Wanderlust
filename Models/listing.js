const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");
const { required } = require("joi");

const listingSchema = new Schema({
    title :{
        type : String,
        required : true ,
    },
    description :{
        type : String,
        required : true,
    },
    image :{
        url : String,
        filename : String,
    },
    price :{
        type : Number,
        required : true,
        min : [500,"price must be atleast 500/night"]
    },
    location :{
        type:String,
        required: true,
    },
    country:{
        type : String,
        required: true,
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner :{
        type : Schema.Types.ObjectId,
        ref : "User"
    },
     geometry: {
        type: {
        type: String,
        enum: ["Point"],
        required: true
        },
        coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
        }
    },
    category :{
        type : String,
        num :[
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
        ],
        required : true,
    }
});

listingSchema.post("findOneAndDelete" , async(listing)=>{
    if(listing){
        await Review.deleteMany({id:{$in : listing.reviews }})
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing ;

