const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId
const bcrypt = require("bcrypt")
let userRoutes = express.Router()
const SALT_ROUNDS = 6
userRoutes.route("/").get(async (request,response) => {
    let db = database.getDb()
    let data = await db.collection("users").find({}).toArray()
    if(data.length>0){
        response.json(data) 
    }
    else{
        throw new error("Data was not found :(")
    }
})

userRoutes.route("/:id").get(async (request,response) => {
    let db = database.getDb()
    let data = await db.collection("users").findOne({_id: new ObjectId(request.params.id)})
    if(Object.keys(data).length>0){
        response.json(data) 
    }
    else{
        throw new error("Data was not found :(")
    }
})

userRoutes.route("/").post(async (request,response) => {
    let db = database.getDb()
    const takenEmail = db.collection("users").findOne({email:request.body.email})
    if (takenEmail){
        response.json({message:"The email is taken"})
    }
    else{
    const hash = bcrypt.hash(request.body.password, SALT_ROUNDS)
    let mongoObject = {
        name:request.body.name,
        email:request.body.email,
        password:hash,
        joinDate: new Date(),
        posts: []
    }
    let data = await db.collection("users").insertOne(mongoObject)
    response.json(data)
}
})

userRoutes.route("/:id").put(async (request,response) => {
    let db = database.getDb()
    let mongoObject = {
    $set: {
        name:request.body.name,
        email:request.body.email,
        password:request.body.password,
        joinDate:request.body.joinDate,
        posts:request.body.posts
    }
}
    let data = await db.collection("users").updateOne({_id: new ObjectId(request.params.id)},mongoObject)
    response.json(data)
})

userRoutes.route("/:id").delete(async (request,response) => {
    let db = database.getDb()
    let data = await db.collection("users").deleteOne({_id: new ObjectId(request.params.id)})
    response.json(data)
})

module.exports = userRoutes
