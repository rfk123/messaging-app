/*
Define the URL and HTTP method.
Here we are basically saying that when someone posts to /signup we run the signup controller and the controller holds the signup logic
This file defines the available endpoints and which controller function should handle each one.
essentially a traffic controller 
*/

const express = require("express");
const { signup, login } = require("../controllers/authControllers");

const router = express.Router(); //create a mini-router just for auth routes

router.post("/signup", signup); // when someone sends a post request to /signup, run the signup function
router.post("/login", login);

module.exports = router;

