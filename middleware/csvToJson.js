const csvToJson = require("csvtojson");


const csvToJsonConverter = (req, res, next) => {
    try {
        const emaillArray = [];
        csvToJson().fromFile(req.file.path).then((jsonObj) => {
            jsonObj.map((item) => emaillArray.push(item.email));
            console.log(emaillArray);

            req.emails = emaillArray;
            next();

            // res.status(200).send({data: jsonObj});
        })
    } catch (err) {
        console.log("error from csvToJsonConverter", err);
        res.status(500).send({ msg: "Internal server error" });
    }
}

module.exports = csvToJsonConverter;