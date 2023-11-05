const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 4000;
// middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// dabase connect here

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.dbURL;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const serviceCollection = client.db("tourSport").collection("service");

    // create service

    app.post("/api/v1/service", async (req, res) => {
      try {
        const service = req.body;
        const result = await serviceCollection.insertOne(service);
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send("Server Internal error", error);
      }
    });

    // get service

    app.get("/api/v1/services", async (req, res) => {
      try {
        const search = req.query.search || "";
        const searchRegExp = new RegExp(".*" + search + ".*", "i");
        const filter = {
          $or: [
            {
              serviceName: { $regex: searchRegExp },
            },
          ],
        };
        const result = await serviceCollection.find(filter).toArray();
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send("Server Internal error", error);
      }
    });

    // get single service

    app.get("/api/v1/service/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await serviceCollection.findOne(filter);

        if (result) {
          res.status(200).send(result);
        } else {
          res.status(404).send("Service not found");
        }
      } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Internal error: " + error);
      }
    });

    // get service filtering by email

    app.get("/api/v1/my-services", async (req, res) => {
      try {
        const email = req.query.email;
        const filter = { serviceProviderEmail: email };
        const result = await serviceCollection.find(filter).toArray();
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send("Server Internal error: " + error);
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
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
