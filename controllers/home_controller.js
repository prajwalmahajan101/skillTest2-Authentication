//Models
const User = require('../models/user')

exports.home = async (req,res,next)=>{

    try {
        //Fetch All Users
        // let  users = await User.find({})
        let  users = await User.where('_id').ne(req.user.id)

        const data = {
            title: "Home",
            users: users,
        }
        //Renders home.ejs from views Folder And Passes the data to ejs file
        res.render('home', data)
    }
    catch (err){
        req.flash('error','Error in Fetching posts from DataBase')
        return res.redirect("back")
    }
}
