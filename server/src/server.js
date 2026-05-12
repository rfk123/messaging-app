//import required packages 
require("dotenv").config(); //load the .env file so we can use inside values

const app = require("./app"); // import the express app created in app.js

const PORT = process.env.PORT || 5000; // use the port from .env if it exists otherwise 5000

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

