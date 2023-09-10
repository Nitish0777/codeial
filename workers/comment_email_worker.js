//this will send the email instead of the via controllers

//creating the worker
const queue =  require('../config/kue');

//import commentsMailer
const commentsMailer = require('../mailers/comments_mailer');



//every worker has process function 
//what does process function do
//it tell the worker that when ever a new task 
//added into the queue you need to run the code inside the process function


//what is job?what need to do is job
//data is the comment which i filled
//this is calling the mail
queue.process('emails',function(job,done){
    console.log('emails worker is working',job.data);

    //new comment function call
    commentsMailer.newComment(job.data);

    done();
})

//this should be call from controllers