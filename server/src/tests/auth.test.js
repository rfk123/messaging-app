
const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");

beforeEach(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE $1 or email LIKE $2", 
        ["%@test.com", "%@example.com"]
    );
});

afterAll( async () => {
    await pool.end();
})

//testing the signup POST route and are expecting a status code of 201 for success
describe("Auth Routes", () => {
    //describe() just groups related tests
    test("POST /api/auth/signup should create new user", async () => {
        const response = await request(app).post("/api/auth/signup").send({
            name: "Reza Kamali",
            email: "testuser@test.com",
            password: "jackAttack",
        });
        //response is a fake request to the express app
        //.post sends a post request to the route
        //.send sends the JSON data in the request body
        expect(response.statusCode).toBe(201); 
    });

    test("POST /api/auth/signup should fail when attempting a duplicate email signup", async () => {
        await request(app).post("/api/auth/signup").send({
            name: "Reza Kamali",
            email: "testuser@test.com",
            password: "password",
        });
        const response = await request(app).post("/api/auth/signup").send({
            name: "Reza Kamali",
            email: "testuser@test.com",
            password: "password",
        });
        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBeDefined();
    });

    test("POST /api/auth/signup with missing fields should fail", async () => {
        const response = await request(app).post("/api/auth/signup").send({
            email: "test@test.com",
            password: "password",
        })
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBeDefined();
    });
});

