//this file connects us to our database

const { Pool } = require("pg"); // allows us to not have to reopen the connection everytime we send requests
require("dotenv").config(); // load the .env file values

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
}); // create the connection pool using the connection string url

module.exports = pool; //export so other backend files can use the pool