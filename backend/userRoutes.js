const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

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

module.exports = userRoutes;