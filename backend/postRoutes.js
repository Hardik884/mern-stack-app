const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId

let postRoutes = express.Router()

postRoutes.route("/").get(async (request,response) => {
    let db = database.getDb()
    let data = await db.collection("posts").find({}).toArray()
    if(data.length>0){
        response.json(data) 
    }
    else{
        throw new error("Data was not found :(")
    }
})

postRoutes.route("/:id").get(async (request,response) => {
    let db = database.getDb()
    let data = await db.collection("posts").findOne({_id: new ObjectId(request.params.id)})
    if(Object.keys(data).length>0){
        response.json(data) 
    }
    else{
        throw new error("Data was not found :(")
    }
})

postRoutes.route("/").post(async (request,response) => {
    let db = database.getDb()
    let mongoObject = {
        title:request.body.title,
        description:request.body.description,
        content:request.body.content,
        author:request.body.author,
        datecreated:request.body.datecreated,
    }
    let data = await db.collection("posts").insertOne(mongoObject)
    response.json(data)
})

postRoutes.route("/:id").put(async (request,response) => {
    let db = database.getDb()
    let mongoObject = {
    $set: {
        title:request.body.title,
        description:request.body.description,
        content:request.body.content,
        author:request.body.author,
        datecreated:request.body.datecreated,
    }
}
    let data = await db.collection("posts").updateOne({_id: new ObjectId(request.params.id)},mongoObject)
    response.json(data)
})

postRoutes.route("/:id").delete(async (request,response) => {
    let db = database.getDb()
    let data = await db.collection("posts").deleteOne({_id: new ObjectId(request.params.id)})
    response.json(data)
})

module.exports = postRoutes
