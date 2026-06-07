
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

const signupUser = async (overrides = {}) => {
    const user = {
        name: "test",
        email: "test@test.com",
        password: "password",
        ...overrides,
    };

    return request(app).post("/api/auth/signup").send(user);
};

//testing the signup POST route and are expecting a status code of 201 for success
describe("Auth Routes", () => {
    describe("POST /api/auth/signup", () => {
        test("Valid user creation responds with success", async () => {
            const response = await request(app).post("/api/auth/signup").send({
                name: "Reza Kamali",
                email: "testuser@test.com",
                password: "jackAttack",
            });
            expect(response.statusCode).toBe(201); 
        });

        test("Duplicate email responds with error", async () => {
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

        test("Missing field responds with error", async () => {
            const response = await request(app).post("/api/auth/signup").send({
                email: "test@test.com",
                password: "password",
            })
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBeDefined();
        });
    })
    describe("POST /api/auth/login", () => {
        test("Valid user login responds with success", async () => {
            await signupUser();
            const response = await request(app).post("/api/auth/login").send({
                email: "test@test.com",
                password: "password",
            });
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBeDefined();
        })

        test("Login with wrong password responds with error", async () => {
            await signupUser();
            
            const response = await request(app).post("/api/auth/login").send({
                email: "test@test.com",
                password: "wrongpassword"
            });

            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBeDefined();
        })

        test("Login with missing field responds with error", async () => {
            const response = await request(app).post("/api/auth/login").send({
                password: "anypassword",
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBeDefined();
        })
    })
    // describe("GET /api/auth/getme", () => {
    //     test("Retrieving a user that doesnt exist responds with error", async () => {
    //         const response = request(app).get("/api/auth/getme").send({

    //         })
    //     })
    // })
});

