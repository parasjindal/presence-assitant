var express = require("express");
var fs = require("fs");

var bodyParser = require("body-parser");

// create application/json parser
var jsonParser = bodyParser.json();

var app = express();

/**
 * request example -
 * /presence?userIds=uid1,uid2
 */
app.get("/presence", function (req, res) {
    try {
        const userIds = req.query["userIds"].split(",");
        let rawdata = fs.readFileSync("presence-data.json");
        let presenceData = JSON.parse(rawdata);
        console.log(userIds);
        if (!userIds) {
            res.send(presenceData);
            return;
        }
        const presenceDataMap = getNewObject(presenceData, userIds);
        res.send(presenceDataMap);
    } catch {
        res.send({});
    }
});

app.post("/presence", jsonParser, function (req, res) {
    const newPresence = req.body["days"];
    const userId = req.body["userId"];
    console.log(newPresence, userId);
    let rawdata = fs.readFileSync("presence-data.json");
    let presenceData = JSON.parse(rawdata);
    presenceData[userId] = newPresence;
    let data = JSON.stringify(presenceData);
    fs.writeFileSync("presence-data.json", data);
    res.send("Updated");
});

app.listen(3000, function () {
    console.log("Example app listening on port 3000!");
});

const getNewObject = (object1, properties) => {
    const result = {};
    properties.forEach((element) => {
        result[element] = object1[element];
    });
    return result;
};
