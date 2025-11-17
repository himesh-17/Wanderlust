const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./Models/listing.js");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const dbUrl = process.env.ATLASDB_URL;
// Mongoose Connection with Server (Express.Js);
async function main() {
   await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});


//Middlewares

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter : 24*3600,
});

store.on("error",()=>{
    console.err("ERROR IN MONGOSTORE" ,err);
})

const sessionOption = {
    store : store,
    secret : process.env.SECRET,
    resave : false , 
    saveUninitialized : true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, 
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true ,
    }
}
app.set("view engine","ejs");
app.set('views',path.join(__dirname,"/views"));
app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));
app.use(session(sessionOption));
app.use(flash());
// For authentication user
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;
    next();
})


// Routes ---->

// Listing Route
const listingRoutes = require('./routes/listings.js');
app.use("/api",listingRoutes);
// Review Route
const reviewRoute = require("./routes/reviews.js");
app.use("/api" , reviewRoute);
// User Route
const userRoute = require("./routes/user.js");
app.use("/api",userRoute);
// footer Route
const footerRoute = require("./routes/footer.js");
app.use("/api" , footerRoute);


// Error Handling Middleware 
app.use((err,req,res,next)=>{
    const { status = 500, msg = "Something went wrong!" } = err;
    res.render("./listings/error.ejs",{msg});
});

app.listen(3000,()=>{
    console.log("Server is listening to port 3000");
})