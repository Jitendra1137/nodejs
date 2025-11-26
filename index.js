import express from 'express';
import bodyParser from 'body-parser';
import mongo from "./mongoC.js";

const port = process.env.PORT || 4000;
const app = express();

/* ---------------------------
   GLOBAL CORS FIX (Very Important)
   --------------------------- */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* ---------------------------
   BODY PARSERS
--------------------------- */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* ---------------------------
   ROUTES
--------------------------- */

app.get('/', (req, res) => {
  res.status(200).send('Hello World, from express');
});

/* Add User */
app.post('/addUser', async (req, res) => {
  try {
    const db = mongo.getDb();
    const collection = db.collection("users");

    let newDocument = req.body;
    newDocument.date = new Date();

    let result = await collection.insertOne(newDocument);

    return res.status(201).send(result);
  } catch (err) {
    console.error("Error in /addUser:", err);
    return res.status(500).send({ error: "Insert failed" });
  }
});

/* Get All Users */
app.get('/getUsers', async (req, res) => {
  try {
    const db = mongo.getDb();
    const collection = db.collection("users");

    let results = await collection.find({}).toArray();
    return res.status(200).send(results);
  } catch (err) {
    console.error("Error in /getUsers:", err);
    return res.status(500).send({ error: "Query failed" });
  }
});

/* ---------------------------
   START SERVER AFTER DB CONNECTS
--------------------------- */
(async () => {
  try {
    await mongo.connectToMongo();
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server due to DB error:", err);
    process.exit(1);
  }
})();
