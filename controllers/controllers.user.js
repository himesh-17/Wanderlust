const User = require("../Models/user");
const passport = require('passport');

module.exports.renderSignup = (req,res)=>{
    res.render("./user/signup.ejs");
};

module.exports.signUpUser = async(req,res)=>{
    try{
        const {username , email, password} = req.body;
        console.log(username,email,password);
        const newUser = new User({username,email});
        const registerUser = await User.register(newUser , password);
        req.login(registerUser ,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success" , "Welcome to Wanderlust!");
        res.redirect("/api/listings");
        });
    }catch(err){
        req.flash("error" , err.message);
        res.redirect("/api/signup");
    }
};

module.exports.renderLogin = (req,res)=>{
    res.render("./user/login.ejs");
};

module.exports.LoginUser = async(req,res)=>{
    const redirectUrl = res.locals.redirectUrl || "/api/listings";
    req.flash("success" , "Welcome back to Wanderlust!");
    res.redirect(redirectUrl);

};

module.exports.logoutUser = (req, res, next) =>{
  req.logout((err)=> {
    if (err) { 
        return next(err);
    }
    req.flash("success" , "Logout successfully");
    res.redirect('/api/listings');
  });
};