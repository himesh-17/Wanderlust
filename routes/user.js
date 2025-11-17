const express = require('express');
const router = express.Router({strict : true , caseSensitive : true , mergeParams : true});
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirect } = require('../middleware');
const userControllers = require("../controllers/controllers.user");

router.get("/signup",userControllers.renderSignup);

router.post("/signup" , wrapAsync(userControllers.signUpUser));

router.get("/login" , userControllers.renderLogin);

router.post("/login",
    saveRedirect,
    passport.authenticate("local",{
        failureRedirect : "/api/login" ,
        failureFlash : true
    }),
    userControllers.LoginUser
);
router.get('/logout', userControllers.logoutUser);


module.exports = router;