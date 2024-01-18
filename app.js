const express = require("express");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const csvToJsonConverter = require("./middleware/csvToJson");
const app = express();
require("dotenv").config();
app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // upload is the upload_folder_name
        cb(null, "upload");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + "-" + Date.now() + ".csv");
    },
});
const upload = multer({ storage: storage });

app.get("/", async (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    res.sendFile(filePath);
});

// const csvToJsonConverter = (req,res,next) => {
//     try{
//         const emaillArray = [];
//         csvToJson().fromFile(req.file.path).then((jsonObj) => {
//             jsonObj.map((item) => emaillArray.push(item.email));
//             console.log(emaillArray);

//             req.emails = emaillArray;
//             next();

//             // res.status(200).send({data: jsonObj});
//         })
//     } catch(err){
//         console.log("error from csvToJsonConverter",err);
//         res.status(500).send({msg: "Internal server error"});
//     }
// }

app.post("/sendEmail", upload.single('file'), csvToJsonConverter, async (req, res) => {
    const emailArray = req.emails;
    // console.log("from sendEmail",emailArray);
    try {
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
            subject: "Email from kshitij using nodemailer",
            text: "Hello sir, How are you."
        }

        //Schedule sending email
        // const date = new Date(Date.now() + 60 * 2000); // Current time + 1 minute in milliseconds
        // console.log(date);

        // schedule.scheduleJob(date, () => {

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log("error", err);
                res.status(500).send({ message: "Can't send email" });
            } else {
                console.log("Email sent: ", info);
                res.status(200).send({ status: "success", message: "Email sent succesfully", response: info.response, envelope: info.envelope });
            }
        })

        // });

    } catch (err) {
        console.log("error", err);
        res.status(500).send("Internal server error");
    }
});


const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log("Server is running on PORT", PORT);
}); 