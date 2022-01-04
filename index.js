const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

//middleware
app.use(cors());
app.use(express.json());

//
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4ovqx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("EasyDev");

    const allCoursesCollection = database.collection("allcourses");
    const enrolledCourseCollection = database.collection("enrollcourse");

    app.get("/allcourses", async (req, res) => {
      const name = req.query.name;
      let filter = {};
      if (name) {
        filter = { name };
      }
      const cursor = allCoursesCollection.find(filter);
      const allCourses = await cursor.toArray();
      res.json(allCourses);
    });

    app.get("/allcourses/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(`${id}`) };
      const cursor = allCoursesCollection.find(filter);
      const enroll = await cursor.toArray();
      res.json(enroll);
    });
    app.post("/enrollcourse", async (req, res) => {
      const data = req.body;
      const result = await enrolledCourseCollection.insertOne(data);
      res.send(result);
    });
    app.get("/enrollcourse", async (req, res) => {
      const email = req.query.userEmail;
      const cursor = enrolledCourseCollection.find({ userEmail: email });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/enrollcourse/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(`${id}`) };
      const cursor = await enrolledCourseCollection.deleteOne(query);
      // const result = await cursor.toArray();
      res.send(cursor);
    });

    console.log("connect successfull");
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening at Port ${port}`);
});
