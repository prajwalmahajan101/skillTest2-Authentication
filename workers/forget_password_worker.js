const queue = require('../configs/kue')


const auth_mailer = require('../mailer/auth_mailer')

queue.process('reset_password_emails',(job,done)=>{
    // console.log("emails worker is processing a job",job.data)
    auth_mailer.forgetPasswordMail(job.data)
    done()
})
