//we need access to the bcrypt package and db pool
const bcrypt = require("bcrypt"); //import bcyrpt which we use to hash the passwords
const pool = require("../config/db"); //import our connection pool so we can query the db
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        //check if any of the required fields are missing, if they are then return status 400 and error message
        if(!name || !email || !password){
            return res.status(400).json({
                message: "Name, email, and password are required",
            });
        }

        //check if there already exists a user with this user email
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if(existingUser.rows.length > 0){
            return res.status(409).json({
                message: "Email already in use",
            });
        }

        //if all the fields are filled and the email is unique then we must hash the password before inserting the user into postgres
        const passwordHash = await bcrypt.hash(password, 10);

        //now we insert the user into postgres
        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, created_at`,
            [name, email, passwordHash]
        );

        //we will need a user object to return in the response
        const user = result.rows[0];

        //response body for successuly user creation
        res.status(201).json({
            message: "User created successfully",
            user,
        });
    } catch (error) {
        console.log("Signup error: ", error);
        res.status(500).json({
            message: "Server error during signup",
        });
    }
};

const login = async (req, res) => {
    try {
        //get the login data from the request body
        const { email, password } = req.body;

        //check for missing required fields 
        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        //get our result object
        const result = await pool.query(
            `SELECT id, name, email, password_hash, created_at
            FROM users
            WHERE email = $1`,
            [email]
        );

        //if result has no rows then there is no user with this information which we must check for
        if(result.rows.length === 0){
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const user = result.rows[0];

        //We must hash the entered password and compare it to the one associated with the entered email
        const passwordMatches = await bcrypt.compare(password, user.password_hash);

        if(!passwordMatches){
            res.status(401).json({
                message: "Invlide email or password",
            });
        }
        
        //create the login token using jwt
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );

        res.json({
            message: "Login success",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at,
            },
        });
    } catch (error) {
        console.log("Login error: ", error);
        res.status(500).json({
            message: "Server error during login",
        });
    }
};

module.exports = {
    signup,
    login,
};