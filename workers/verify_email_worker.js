const queue = require('../configs/kue')


const auth_mailer = require('../mailer/auth_mailer')

queue.process('verify_emails',(job,done)=>{
    // console.log("emails worker is processing a job",job.data)
    auth_mailer.emailVerificationMail(job.data)
    done()
})
