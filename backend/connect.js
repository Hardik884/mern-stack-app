const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({ path: "./config.env" });

const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database;

module.exports = {
  connectToServer: async () => {
    try {
      await client.connect(); 
      database = client.db("blogData");
      console.log("Connected to MongoDB.");
    } catch (err) {
      console.error("MongoDB connection failed:", err);
    }
  },

  getDb: () => {
    if (!database) {
      throw new Error("Database not initialized. Call connectToServer() first.");
    }
    return database;
  }
};


/*async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);*/
