//Modules
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const auth_mailer = require('../mailer/auth_mailer')
//Models


const User = require('../models/user')
const Request  =require('../models/email_verification_request')
// Actions

exports.profile = async (req,res,next) =>{
    try {
        let user = await User.findById(req.params.id)
        if (!user) {
            req.flash('error',"User asked for Doesn't Exist")
            return res.redirect("back")
        } else {
            return res.render("user_profile", {
                user: req.user,
                req_user: user,
                title: "Profile",
                flash:{
                    success : 'Userdata Loaded'
                }
            })
        }
    }
    catch (err){
        req.flash('error','Error in Finding User Data')
        return res.redirect("back")
    }
}

exports.signUp = (req,res,next)=>{
    if(req.isAuthenticated()) {
        req.flash('error','You are Already Logged-in')
        return res.redirect("/")
    }
    res.render('user_sign_up',{
        title:"Sign Up"
    })

}

exports.signIn = (req,res,next)=>{
    if(req.isAuthenticated()) {
        req.flash('error','You are Already Logged-in')
        return res.redirect("/")
    }
    res.render('user_sign_in',{
        title:"Sign In"
    })

}



exports.createUser = async (req,res,next) =>{
    const formData = req.body
    if(formData.password!== formData.confirm_password) {
        req.flash('error',"Password Didn't Match")
        return res.redirect("back")
    }
    else {
        try {
            let user = await User.findOne({email: formData.email})
            if (!user) {
                const simplePassword = formData.password
                let new_password = await bcrypt.hash(simplePassword, 10)
                formData.password = new_password
                user = await User.create(formData)
                let request = await Request.create({user:user.id})
                auth_mailer.emailVerificationMail(user,request.id)
                req.flash('success','User Signed Up')
                return res.redirect("/users/sign-in")
            } else {
                req.flash('error',"User with the email id Already Exists")
                return res.redirect("back")
            }
        }catch(err){
            req.flash('error',"Error occurred while creating User. Please Try Again in Sometime")
            return res.redirect("back")
        }
    }

}

exports.createSession = (req,res,next) =>{
    req.flash('success','Logged-in Successfully')

    res.redirect("/")
}

exports.destroySession=(req,res,next)=>{

    req.logout((err)=>{
        if(err) {
            return next(err)
        }
        req.flash('success','You have Logged Out')
        res.redirect("/users/sign-in")
    });

}


exports.upDateUser =(req,res,next)=>{
    if(req.user.id===req.params.id){
        User.findById(req.params.id,async (err,user)=>{
            if(err){
                req.flash('error',"Error occurred while Updating the User. Please Try Again in Sometime")
                return res.redirect("back")
            }
            user.name = req.body.name
            if(user.email!==req.body.email){
                user.isEmailVerified = false
                user.email= req.body.email
                let request = await Request.create({user:user})
                auth_mailer.emailVerificationMail(user,request.id)
                req.flash('info','Email has been Changed it is needed To be Verified')
            }
            user.save()
            req.flash('success','User Updated Successfully')
            return res.redirect("/")
        })

    }
    else{
        req.flash('error',"You are Not Authorized to Update this User")
        return res.redirect("/")
    }


}

exports.forgetPassword = (req,res,next)=>{
    res.render('forget_password',{
        title:"Forget Password"
    })
}

exports.generatePassword = async (req,res,next) =>{
    const email = req.body.email
    const user = await User.findOne({email:email})
    const newPassword = crypto.randomBytes(3).toString('hex')
    user.password = await bcrypt.hash(newPassword, 10);
    user.isPasswordUserCreated = false
    user.save()
    auth_mailer.forgetPasswordMail(user,newPassword)
    req.flash('success','A email is sent with your new password to your email id')
    return res.redirect("/users/sign-in")
}


exports.createPassword=async (req,res,next)=>{
    const formData =req.body
    if(formData.password!==formData.confirm_password){
        req.flash('error',"Passwords doesn't match with each other" )
        return res.redirect("/")
    }
    else{
        req.user.password = await bcrypt.hash(formData.password, 10)
        req.user.isPasswordUserCreated = true
        req.user.save()
        return res.redirect('/')
    }
}

exports.resendEmailVerificationMail = async (req,res,next) =>{
    if(! req.user){
        req.flash('error','Your Are Not Logged in')
        return res.redirect('/')
    }
    else if(req.user.isEmailVerified){
        req.flash('error','Your Email is already verified')
         return res.redirect("/")
    }
    else{
        try {
            let request = await Request.findOne({user: req.user.id})
            if (!request) {
                request = await Request.create({user: req.user.id})
            }
            auth_mailer.emailVerificationMail(req.user,request.id)
            req.logout((err)=>{
                if(err) {
                    return next(err)
                }
                req.flash('success','Email Resent')
                res.redirect("/users/sign-in")
            });

        }catch (err){
            req.flash('error', 'Error in Resending The mail Try Again Later')
            return res.redirect("/")
        }

    }
}

exports.verifyEmail= async (req,res,next) =>{
    let id = req.params.id
    try{
        let request = await Request.findById(id).populate('user')
        if(! request) req.flash('error','Wrong Link')
        else{
            let user = request.user
            user.isEmailVerified = true
            user.save()
            request.remove()
            req.flash('success','Email Verified')
        }
    }
    catch (err) {req.flash('error','Error Occurred during verification') }
    if(req.user) return res.redirect("/")
    return res.redirect("/users/sign-in")
}

exports.destroyUser = (req,res,next) =>{
    req.user.remove()
    req.logout((err)=>{
        if(err) {
            return next(err)
        }
        req.flash('success','You have Deactivated Your Account')
        res.redirect("/users/sign-in")
    });
}