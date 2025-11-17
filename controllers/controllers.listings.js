const Listing = require("../Models/listing");
const geocode = require('../utils/geoCode');

module.exports.index = async(req,res)=>{
   let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderAddForm =  (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.addNew = async (req,res,next)=>{
    if (!req.file) {
            req.flash("error", "Image upload failed or no image provided.");
            return res.redirect("/api/listings/new");
        }
    let url =req.file.path;
    let filename = req.file.filename;
    const {title,description,price,location,country,category} = req.body;
    const listing = {
        title : title,
        description : description ,
        image : {
            url : url ,
            filename : filename,
        },
        price : price,
        location : location ,
        country : country,
        category : category,
    }
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    const coordinates = await geocode(location);
    
    if (!coordinates || !coordinates.lat || !coordinates.lon) {
        req.flash("error", "Invalid location.");
        return res.redirect("/api/listings/new");
    }
    newListing.geometry = {
        type: "Point",
        coordinates: [coordinates.lon, coordinates.lat]
    };
    await newListing.save();
    req.flash("success" ,"New Listing Created!");
    res.redirect("/api/listings");
};

module.exports.viewListing = async(req,res)=>{
    const {id} = req.params;
    const data = await Listing.findById(id)
    .populate({path : "reviews",
        populate :{
        path : "author"
    }})
    .populate("owner");
    if(!data){
        req.flash("error","Listing you requested for does not exits");
        res.redirect("/api/listings");
    }
    res.render("./listings/show.ejs",{data});
};

module.exports.renderEditForm = async(req,res)=>{
    const{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exits");
        res.redirect("/api/listings");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload" , "/upload/W_250")
    res.render("./listings/update.ejs" ,{listing , originalImage});
};

module.exports.editListing = async(req,res)=>{
    const{id} = req.params;
    const {title,description,price,location,country,category} = req.body;
    const updateListing = {
    title : title,
    description : description ,
    price : price,
    location : location ,
    country : country,
    category : category,
 }
  let listing = await Listing.findByIdAndUpdate(id,updateListing);
  if(typeof req.file !== "undefined"){
        let url =req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename}
        await listing.save();
    }
 req.flash("success","Listing Updated !");
 res.redirect( `/api/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    const {id} = req.params ;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted !");
    res.redirect("/api/listings");
};

module.exports.filter = async (req, res, next) => {
    const { category } = req.params;
    const listings = await Listing.find({ category : category });
    if (listings.length === 0) {
        req.flash("error", `No listings found for ${category}`);
        return res.redirect("/api/listings");
    }
    res.render("listings/index.ejs", { allListings: listings });
};

module.exports.search = async (req, res) => {
    const {q} = req.query;
    let filter = {};
    if (q && q.trim() !== "") {
        filter.$or = [
            { country: { $regex: q, $options: "i" } },
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } }
        ];
    }
    console.log(filter);
    const listings = await Listing.find(filter);
    if (listings.length === 0) {
        req.flash("error", `No location found for "${q}"`);
        return res.redirect("/api/listings");
    }
    res.render("./listings/index.ejs", { allListings : listings });
};

