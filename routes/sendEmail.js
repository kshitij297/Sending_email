const express = require("express");
const routes = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();
const schedule = require("node-schedule");

console.log(process.env.EMAIL, process.env.EMAIL_PASS);


routes.post("/sendEmail", async(req,res) => {
    const { subject, text} = req.body;
    const emailArray = ['kshitijgupta782@gmail.com', 'kshitijgupta153@gmail.com', 'kshitijgupta2907@gmail.com'];

    if(!subject || !text){
        res.status(401).send({message: "Unprocessible entity"});
    }

try{
    const transporter = nodemailer.createTransport({
        service: 'gmail',   
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: emailArray,
        subject: subject,
        text: text
    }


    //Schedule sending email
    // const date = new Date(Date.now() + 60 * 2000); // Current time + 1 minute in milliseconds
    // console.log(date);
    
    // schedule.scheduleJob(date, () => {

        transporter.sendMail(mailOptions, (err, info) => {
            if(err){
                console.log("error",err);
                res.status(500).send({message: "Can't send email"});
            } else{
                console.log("Email sent: ", info);
                res.status(200).send({status: "success",message: "Email sent succesfully", response: info.response, envelope: info.envelope});
            }
        })

    // });

} catch(err){
    console.log("error",err);
    res.status(500).send("Internal server error");
}
});

module.exports = routes;