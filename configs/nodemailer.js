const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')


let transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port: 465,
    secure: true,
    auth :{
        user: process.env.mailacc ||'noReply.authenticator.skillTest@gmail.com',
        pass: process.env.pass
    }
})

let renderTemplate = (data,relativePath) =>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        (err,template)=>{
            if(err){
                console.log("Error in Rendering Template ",err)
                return
            }
            mailHTML = template
        }
    )
    return mailHTML
}

module.exports = {
    transporter:transporter,
    renderTemplate:renderTemplate,
}


