const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clvrh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const messageCollection = client
      .db("brainaliveOfficial")
      .collection("contactMessages");
    console.log("Database connected");

    app.post("/messages", async (req, res) => {
      const newMessage = req.body;
      console.log(newMessage);
      const result = await messageCollection.insertOne(newMessage);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
