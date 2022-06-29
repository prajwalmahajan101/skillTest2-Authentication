const nodeMailer = require('../configs/nodemailer')

exports.forgetPasswordMail = (data) => {
    let user = data.user
    let password = data.password
    const html = nodeMailer.renderTemplate(
        {
            username: user.name,
            password: password
        },
        '/forget_password_mail.ejs')
    nodeMailer.transporter.sendMail({
        from: "prajwal.mahajan@gmail.com",
        to: user.email,
        subject: "Reset Password",
        html: html
    },(err,info)=>{
        if(err) console.log("Error in Sending Mails",err)
        // else console.log("Message Sent ", info)
        return
    })
}

exports.emailVerificationMail = (data) => {
    let user = data.user
    let id = data.id
    const html = nodeMailer.renderTemplate(
        {
            username: user.name,
            id: id
        },
        '/email_verify.ejs')
    nodeMailer.transporter.sendMail({
        from: "prajwal.mahajan@gmail.com",
        to: user.email,
        subject: "Verify Your Email",
        html: html
    },(err,info)=>{
        if(err) console.log("Error in Sending Mails",err)
        // else console.log("Message Sent ", info)
        return
    })

}
