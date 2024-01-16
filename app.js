const express = require("express");
require("dotenv").config();
const app = express();
const sendEmail = require("./routes/sendEmail");
const cors = require("cors");
const schedule = require("node-schedule");

app.use(express.json());
app.use(cors());

app.get("/", async(req,res) => {
    res.send("Sending email using nodemailer");
});

app.use("/api",sendEmail);



// const date = new Date('2024-01-16T14:41:00.000Z')


const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log("Server is running on PORT", PORT);
});