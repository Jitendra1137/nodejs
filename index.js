// index.js
import express from 'express';
import bodyParser from 'body-parser';
import mongo from './mongoC.js';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const app = express();

// CORS (simple)
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  next();
});

// Body parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes (they will use the db after connection is ready)
app.get('/', (req, res) => {
  res.status(200).send('Hello World, from express');
});

app.post('/addUser', async (req, res) => {
  try {
    const db = mongo.getDb();
    const collection = db.collection("users");
    const newDocument = req.body;
    newDocument.date = new Date();
    const result = await collection.insertOne(newDocument);
    return res.status(201).send(result);
  } catch (err) {
    console.error("Error in /addUser:", err);
    return res.status(500).send({ error: 'Insert failed' });
  }
});

app.get('/getUsers', async (req, res) => {
  try {
    const db = mongo.getDb();
    const collection = db.collection("users");
    const results = await collection.find({}).toArray();
    return res.status(200).send(results);
  } catch (err) {
    console.error("Error in /getUsers:", err);
    return res.status(500).send({ error: 'Query failed' });
  }
});

// Start server only after DB connects
(async () => {
  try {
    await mongo.connectToMongo();
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is listening at port: ${port}`);
    });
  } catch (err) {
    console.error("Failed to start app due to MongoDB connection error. Exiting.");
    process.exit(1);
  }
})();
