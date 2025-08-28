const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken')
let awsRoutes = express.Router();
require("dotenv").config({ path: "./config.env" });
const {S3Client, PutObjectCommand,GetObjectCommand,DeleteObjectCommand} = require("@aws-sdk/client-s3");
const s3Bucket = "blogstorage7"

const s3Client = new S3Client({
    region:"ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY ,
        secretAccessKey:process.env.AWS_SECRET_KEY
    }
})

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

awsRoutes.route("/images/:id").get(verifyToken,async (request, response) => {
    const id = request.params.id
    const bucketParams = {
        bucket: s3Bucket,
        Key: id,
    }
    
    const data = await s3Client.send(new PutObjectCommand(bucketParams))

    const contentType = data.ContentType
    const srcString  = await data.body.transformToString('base64')
    const imageSource = `data:${contentType};base64,${srcString}`
    response.json(imageSource)
});

awsRoutes.route("/images").post(verifyToken,async (request, response) => {
    const file = request.body;
    const bucketParams = {
        bucket: s3Bucket,
        Key: file.name,
        Body:file
    }
    
    const data = await s3Client.send(new PutObjectCommand(bucketParams))
    response.json(data)
});



module.exports = awsRoutes;