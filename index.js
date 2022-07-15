const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome To ToDo App");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2u3tg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("todoApp").collection("task");
    // FIND ALL TASK
    app.get("/all-tasks", async (req, res) => {
      const task = await taskCollection.find().toArray();
      res.send(task);
    });
    // FIND TASK ON ID
    app.get("/task-details/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await taskCollection.find(filter).toArray();
      res.send(result);
    });
    // TASK POST
    app.post("/task", async (req, res) => {
      const task = req.body;
      console.log(task);
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });
    // UPDATE TASK
    app.put("/edit-text/:id", async (req, res) => {
      const id = req.params.id;
      const updateTask = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          text: updateTask.newText,
        },
        $set: updateTask,
      };
      const result = await taskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    // COMPLEAT TASK
    app.put("/compleat/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: { status: "compleat" },
      };
      const result = await taskCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    // FIND COMPLEAT TASK
    app.get("/compleat", async (req, res) => {
      const filter = { status: "compleat" };
      const result = await taskCollection.find(filter).toArray();
      res.send(result);
    });
    // DELETE TASK
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
