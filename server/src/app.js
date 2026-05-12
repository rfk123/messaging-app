//import required packages
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");


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

app.get("/api/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            status: "ok",
            dataBaseTime: result.rows[0].now,
        });
    } catch (error) {
        console.log("Database test error:", error);
        res.status(500).json({
            status: "error",
            message: "Database connection failed",
        });
    }
})
module.exports = app; //export the app so server.js can use it



