//import required packages
const express = require("express");
const cors = require("cors");


const app = express(); //create an express instance

//app is essentially our backend server object
app.use(cors()); // allow other origins to call this backend 
app.use(express.json()); // allow express to understand json request bodies

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Messaging app backend is running",
    });
}); // a test route

module.exports = app; //export the app so server.js can use it



