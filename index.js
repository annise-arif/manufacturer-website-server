const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// midle ware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sdyij.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 
async function run(){
  try{
    await client.connect();
    const serviceCollection = client.db("hammer-drill-station").collection("services");
    const orderCollection = client.db("hammer-drill-station").collection("orders");
    
    app.get('/services', async(req, res) =>{
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services)
    });
    app.get('/services/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services)
    });
    app.post('/order', async(req, res) =>{
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });
    app.get('/myorders/:email', async(req, res) =>{
      const email = req.params.email;
      const query = {email: email};
      const cursore = orderCollection.find(query);
      const result = await cursore.toArray();
      res.send(result);
    })
  }
  catch{

  }

}

run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Hello From Hammer drill Station");
  });
  
  app.listen(port, () => {
    console.log(`Hammer drill Station listening on port ${port}`);
  });