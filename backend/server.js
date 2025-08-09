// server.js
require("dotenv").config({ path: "./config.env" });
const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const posts = require("./postRoutes");
const users = require("./userRoutes");

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());


connect.connectToServer().then(() => {
  app.use('/posts', posts);
  app.use('/users', users); 

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to MongoDB:", err);
});