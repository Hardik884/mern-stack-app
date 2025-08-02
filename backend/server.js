const express = require('express');
const cors = require('cors');
const connect = require('./connect');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


connect.connectToServer().then(() => {
  const posts = require('./postRoutes'); 
  app.use('/posts', posts);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to MongoDB:", err);
});
