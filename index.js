const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 4000;
// biltIn middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// dabase connect here

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.dbURL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// Server Root enpoint

app.get("/", (req, res) => {
  try {
    res.status(200).send("<h1>CareerNest Server is Running ...</h1>");
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is runnig at http://localhost:${PORT}`);
});
