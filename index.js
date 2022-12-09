const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

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

    const blogsCollections = client
      .db("brainaliveOfficial")
      .collection("blogsCollections");

    const draftCollections = client
      .db("brainaliveOfficial")
      .collection("draftsCollections");

    const archivesCollections = client
      .db("brainaliveOfficial")
      .collection("archiveCollections");

    app.post("/messages", async (req, res) => {
      const newMessage = req.body;
      const result = await messageCollection.insertOne(newMessage);
      res.send(result);
    });

    // posting blog from post builder
    app.post("/allBlogs", async (req, res) => {
      const newBlog = req.body;
      const result = await blogsCollections.insertOne(newBlog);
      res.send(result);
    });

    // getting all blogs
    app.get("/getAllBlogs", async (req, res) => {
      blogsCollections.find().toArray((err, events) => {
        res.send(events);
      });
    });

    // getting single blog by dynamic id
    app.get("/blog/:id", (req, res) => {
      blogsCollections
        .find({ _id: ObjectId(req.params.id) })
        .toArray((err, documents) => {
          res.send(documents[0]);
        });
    });

    // updating blog by dynamic id
    app.patch("/updateBlog/:id", (req, res) => {
      const newBlogData = req.body.updatedBlog;

      blogsCollections
        .updateOne(
          { _id: ObjectId(req.params.id) },
          {
            $set: {
              coverImg: newBlogData.coverImg,
              blogTitle: newBlogData.blogTitle,
              tag: newBlogData.tag,
              blogContent: newBlogData.blogContent,
            },
          }
        )

        .then((result) => {
          res.send(result);
        });
    });

    // deleting blog by archiving
    app.delete("/blog/delete/:id", (req, res) => {
      blogsCollections
        .deleteOne({ _id: ObjectId(req.params.id) })
        .then((result) => {
          console.log(result);
          res.send(result);
        });
    });

    // adding draft from blog post builder
    app.post("/addDraft", async (req, res) => {
      const newDraft = req.body;
      const result = await draftCollections.insertOne(newDraft);
      res.send(result);
    });

    //geting all drafts
    app.get("/getDrafts", async (req, res) => {
      draftCollections.find().toArray((err, events) => {
        res.send(events);
      });
    });

    //geting single draft by dynamic id
    app.get("/draft/:id", (req, res) => {
      draftCollections
        .find({ _id: ObjectId(req.params.id) })
        .toArray((err, documents) => {
          res.send(documents[0]);
        });
    });

    //updating blog by dynamic id
    app.patch("/updateDraftBlog/:id", (req, res) => {
      const newDraftData = req.body.updatedDraft;
      console.log(newDraftData);

      draftCollections
        .updateOne(
          { _id: ObjectId(req.params.id) },
          {
            $set: {
              coverImg: newDraftData.coverImg,
              blogTitle: newDraftData.blogTitle,
              tag: newDraftData.tag,
              blogContent: newDraftData.blogContent,
            },
          }
        )

        .then((result) => {
          res.send(result);
          console.log(result);
        });
    });

    //deleting draft after posting
    app.delete("/delete/draft/:id", (req, res) => {
      draftCollections
        .deleteOne({ _id: ObjectId(req.params.id) })
        .then((result) => {
          console.log(result);
          res.send(result);
        });
    });

    // adding draft from blog post builder
    app.post("/addArchive", async (req, res) => {
      const newArchive = req.body;
      const result = await archivesCollections.insertOne(newArchive);
      res.send(result);
    });

    //geting all drafts
    app.get("/getAllArchive", async (req, res) => {
      archivesCollections.find().toArray((err, events) => {
        res.send(events);
      });
    });

    //deleting draft file
    app.delete("/archive/delete/:id", (req, res) => {
      archivesCollections
        .deleteOne({ _id: ObjectId(req.params.id) })
        .then((result) => {
          console.log(result);
          res.send(result);
        });
    });
    // end
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
