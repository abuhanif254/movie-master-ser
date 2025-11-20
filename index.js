

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://mohammadbitullah3_db_user:YyJ8n7aheyn53gxb@cluster0.k0txmhp.mongodb.net/?appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// আপনার .env ফাইলে থাকা ইউজারনেম ও পাসওয়ার্ড ব্যবহার করা হচ্ছে
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k0txmhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server (optional starting in v4.7)
    // await client.connect();

    const movieCollection = client.db('movieMasterDB').collection('movies');

    // ১. মুভি ডাটা রিসিভ করে ডাটাবেসে সেভ করার API (Create)
    app.post('/movies', async (req, res) => {
        const newMovie = req.body;
        console.log('Adding new movie:', newMovie);
        
        const result = await movieCollection.insertOne(newMovie);
        res.send(result);
    });

    // ২. সব মুভি পাওয়ার API (Read)
    app.get('/movies', async (req, res) => {
        const cursor = movieCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();  <---- এটি অবশ্যই কমেন্ট করে রাখবেন, নাহলে সার্ভার বন্ধ হয়ে যাবে
  }
}
run().catch(console.dir);

// রুট রাউট চেক করার জন্য
app.get('/', (req, res) => {
    res.send('MovieMaster Pro Server is running')
})

app.listen(port, () => {
    console.log(`Movie Server is running on port: ${port}`)
})