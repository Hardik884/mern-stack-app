const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken')
let postRoutes = express.Router();
require("dotenv").config({ path: "./config.env" });

function verifyToken(request,response,next){
    const authHeaders = request.headers["authorization"]
    const token = authHeaders && authHeaders.split(' ')[1]
    if(!token){
        return response.status(401).json({message: "Authentication token is missing"})
    }

    jwt.verify(token,process.env.SECRETKEY,(error,decoded)=> {
        if(error){
            return response.status(403).json({message: "Invalid Token"})

        }

        request.user = decoded
        next()

    })
}

postRoutes.route("/").get(verifyToken , async (request, response) => {
    try {
        let db = database.getDb();
        let data = await db.collection("posts").find({}).toArray();
        response.json(data);
    } catch (err) {
        console.error("Error fetching posts:", err);
        response.status(500).json({ message: "An internal server error occurred." });
    }
});


postRoutes.route("/:id").get(verifyToken,async (request, response) => {
    try {
        if (!ObjectId.isValid(request.params.id)) {
            return response.status(400).json({ message: "Invalid post ID format." });
        }
        let db = database.getDb();
        let data = await db.collection("posts").findOne({ _id: new ObjectId(request.params.id) });

        if (!data) {
            return response.status(404).json({ message: "Post not found." });
        }
        response.json(data);
    } catch (err) {
        console.error("Error fetching single post:", err);
        response.status(500).json({ message: "An internal server error occurred." });
    }
});

postRoutes.route("/").post(verifyToken,async (request, response) => {
    try {
        let db = database.getDb();
        const { title, description, content, author } = request.body;

        if (!title || !description || !content) {
            return response.status(400).json({ message: "Title, description, and content are required." });
        }

        let newPost = {
            title: title,
            description: description,
            content: content,
            author: author, 
            datecreated: new Date(),
        };

        let result = await db.collection("posts").insertOne(newPost);
        response.status(201).json({ message: "Post created successfully", postId: result.insertedId });

    } catch (err) {
        console.error("Error creating post:", err);
        response.status(500).json({ message: "An internal server error occurred." });
    }
});


module.exports = postRoutes;