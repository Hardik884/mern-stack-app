const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: "./config.env" });
let userRoutes = express.Router();
const SALT_ROUNDS = 10;

userRoutes.route("/").post(async (request, response) => {
    try {
        let db = database.getDb();
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({ message: "Name, email, and password are required." });
        }

        const takenEmail = await db.collection("users").findOne({ email: email });
        if (takenEmail) {
            return response.status(400).json({ message: "This email is already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        let newUser = {
            name: name,
            email: email,
            password: hashedPassword,
            joinDate: new Date(),
            posts: []
        };

        let result = await db.collection("users").insertOne(newUser);

        response.status(201).json({ message: "User created successfully", userId: result.insertedId });

    } catch (err) {
        console.error("Error creating user:", err);
        response.status(500).json({ message: "An internal server error occurred." });
    }
});

userRoutes.route("/").get(async (request, response) => {
    try {
        let db = database.getDb();
        let data = await db.collection("users").find({}).toArray();
        response.json(data);
    } catch (err) {
        console.error("Error fetching users:", err);
        response.status(500).json({ message: "An internal server error occurred." });
    }
});

userRoutes.route("/:id").get(async (request, response) => {
    try {
        if (!ObjectId.isValid(request.params.id)) {
            return response.status(400).json({ message: "Invalid user ID format." });
        }
        let db = database.getDb();
        let data = await db.collection("users").findOne({ _id: new ObjectId(request.params.id) });

        if (!data) {
            return response.status(404).json({ message: "User not found." });
        }
        response.json(data);
    } catch (err) {
        console.error("Error fetching user:", err);
        response.status(500).json({ message: "An internal server error occurred." });
    }
});



userRoutes.route("/login").post(async (request, response) => {
    try {
        let db = database.getDb();
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({ message: "Email and password are required." });
        }

        const user = await db.collection("users").findOne({ email: email });

        if (!user) {
            return response.status(401).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return response.status(401).json({ success: false, message: "Incorrect Password" });
        }

        const token = jwt.sign({ userId: user._id, name: user.name }, process.env.SECRETKEY, { expiresIn: "1h" });
        response.status(200).json({ success: true, token: token });

    } catch (err) {
        console.error("Error during login:", err);
        response.status(500).json({ message: "An internal server error occurred." });
    }
});
module.exports = userRoutes;