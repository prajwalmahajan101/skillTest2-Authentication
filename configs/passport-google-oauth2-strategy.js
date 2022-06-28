// Modules
const passport = require('passport')
const googleStrategy = require('passport-google-oauth').OAuth2Strategy
const crypto = require('crypto')
const bcrypt = require("bcrypt")

//Modles
const User = require('../models/user')


passport.use(new googleStrategy({
        clientID: process.env.clientID,
        clientSecret:process.env.clientSecert,
        callbackURL:process.env.callback //'http://localhost:8080/users/auth/google/callback'
},
    (accessToken,refreshToken,profile,done)=>{
    User.findOne({email:profile.emails[0].value}).exec((err,user)=>{
        if(err){
            console.log("Error Occurred in Google Authentication Strategy")
            return done(err)
        }
        // console.log(profile)
        if(user){
            user.isEmailVerified = true
            user.save()
            return done(null,user)
        }
        else{
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex'),
                isEmailVerified:true,
                isPasswordUserCreated:false,
            },(err,user)=>{
                if(err){
                    console.log("Error in Creating User ")
                    return done(err)
                }
                else{
                    return done(null,user)
                }
            })
        }
    })

}))

module.exports = passport

