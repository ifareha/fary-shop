const {userModel} = require('../models/user');
const passport = require('passport');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://blinkit-2-ycqd.onrender.com"
  },
 async  function(accessToken, refreshToken, profile, cb) {
   try{
    let user = await userModel.findOne({email : profile.emails[0].value});
    if (!user) {
        user = new userModel({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
        });
        await user.save();
    }
       cb(null, user);
   }
   catch(err){
   cb(err,false);
   }
  }
));

passport.serializeUser(function(user, cb) {
  return cb(null, user._id);
});

passport.deserializeUser(async function(id, cb) {
    try{
    let user = await userModel.findOne({_id: id});
    cb(null, user);
    }
    catch(err){
    cb(err,false);
    }
})

module.exports = passport;