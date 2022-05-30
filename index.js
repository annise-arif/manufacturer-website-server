const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const query = require("express/lib/middleware/query");
const port = process.env.PORT || 5000;

// midle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sdyij.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  await client.connect();
  const serviceCollection = client
    .db("hammer-drill-station")
    .collection("services");
  const orderCollection = client
    .db("hammer-drill-station")
    .collection("orders");
  const reviewsCollection = client
    .db("hammer-drill-station")
    .collection("reviews");
  const userCollection = client.db("hammer-drill-station").collection("users");

  app.get("/services", async (req, res) => {
    try {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.get("/services/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.post("/order", async (req, res) => {
    try {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.get("/myorders/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const query = { email: email };
      const cursore = orderCollection.find(query);
      const result = await cursore.toArray();
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.delete("/myorders/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(filter);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get("/reviews", async (req, res) => {
    try {
      const query = {};
      const cursore = reviewsCollection.find(query);
      const result = await cursore.toArray();
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.post("/reviews", async (req, res) => {
    try {
      const order = req.body;
      const result = await reviewsCollection.insertOne(order);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.get("/allusers", async (req, res) => {
    try {
      const result = await userCollection.find().toArray();
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.put("/user/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updatedDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send({ result });
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.get("/admin/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user.role === "admin";
      res.send({ admin: isAdmin });
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.put("/user/admin/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const filter = { email };
      const updatedDoc = {
        $set: { role: "admin" },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.get("/manageproducts", async (req, res) => {
    try {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.get("/manageallorders", async (req, res) => {
    try {
      const result = await orderCollection.find().toArray();
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.delete("/manageallorders/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(filter);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.delete("/manageproduct/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(filter);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.post("/addaproduct", async (req, res) => {
    try {
      const product = req.body;
      const result = await serviceCollection.insertOne(product);
      res.send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.listen(port, () => {
    console.log(`Hammer drill Station listening on port ${port}`);
  });
}

run().catch(console.dir);
