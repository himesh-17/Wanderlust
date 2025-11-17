const express = require('express');
const router = express.Router({strict : true , caseSensitive : true});
const Listing = require('../Models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const{listingSchema} = require("../schema.js");
const ExpressError = require('../utils/ExpressError.js');
const {validateError,isLoggedIn,isOwner} = require("../middleware.js");
const listingControllers = require("../controllers/controllers.listings.js");
const multer  = require('multer');
const {cloudinary,storage} = require("../cloudConfig.js");
const upload = multer({storage});

// Show all listings ----------->

router.route("/listings")
.get(wrapAsync(listingControllers.index))
.post(isLoggedIn, upload.single("image"), validateError, wrapAsync(listingControllers.addNew));
// route for the search bar----> 
router.get("/listings/search", isLoggedIn ,validateError,wrapAsync(listingControllers.search));

router.get("/listings/new",isLoggedIn, listingControllers.renderAddForm);

router.route("/listings/:id")
.get(wrapAsync(listingControllers.viewListing))
.put(isLoggedIn, isOwner,upload.single("image"), validateError,wrapAsync(listingControllers.editListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingControllers.deleteListing));

router.get("/listings/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.renderEditForm));


// router for filters ---->

router.get("/filter/:category", wrapAsync(listingControllers.filter));

module.exports = router;