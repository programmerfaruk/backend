const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5001;

//middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://amin11588:9bGck87pnSlrGcYZ@cluster0.zyvfoih.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const ecommerceCategory = client.db("ecommerce").collection("category");
    const commerceCollection = client.db("commerceCollectionDB").collection("allproduct");

    app.post("/product", async (res, req) => {
      const newProduct = res.body;
      // console.log(newProduct);
      const result = await commerceCollection.insertOne(newProduct);
      res.send(result)
    })

    app.get("/product", async (req, res) => {
      const result = await commerceCollection.find().toArray()
      res.send(result)
    })

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      const result = await commerceCollection.findOne(query);
      res.send(result);
    })

    app.get("/categorys", async (req, res) => {
      const result = await ecommerceCategory.find().toArray();
      // console.log(result);
      res.send(result);
    });



    app.get("/categories/categoriesDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      console.log(id);
      const result = await ecommerceCategory.findOne(query);
      // console.log(result);
      res.send(result);
    });



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Hello From Server")
});

app.listen(port, () => {
  console.log(`server is running port ${port}`);
})