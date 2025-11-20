

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k0txmhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


let movieCollection;

async function run() {
  try {
   
    movieCollection = client.db('movieMasterDB').collection('movies');

   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("🔴 MongoDB Connection Error:", error);
  }
}
run();


app.post('/movies', async (req, res) => {
    if (!movieCollection) return res.status(500).send("Database not connected");
    const newMovie = req.body;
    const result = await movieCollection.insertOne(newMovie);
    res.send(result);
});


app.get('/movies', async (req, res) => {
    if (!movieCollection) return res.status(500).send("Database not connected");
    const cursor = movieCollection.find();
    const result = await cursor.toArray();
    res.send(result);
});


app.get('/movies/:id', async (req, res) => {
    const id = req.params.id;
    console.log("✅ Hit Single Movie Route with ID:", id); 

    if (!movieCollection) return res.status(500).send("Database not connected");

    try {
        const query = { _id: new ObjectId(id) };
        const result = await movieCollection.findOne(query);
        res.send(result);
    } catch (error) {
        console.error("Error fetching movie:", error);
        res.status(500).send("Error fetching data");
    }
});


app.delete('/movies/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await movieCollection.deleteOne(query);
    res.send(result);
});


app.put('/movies/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatedMovie = req.body;
    const movie = {
        $set: {
            title: updatedMovie.title,
            poster: updatedMovie.poster,
            genre: updatedMovie.genre,
            duration: updatedMovie.duration,
            releaseYear: updatedMovie.releaseYear,
            rating: updatedMovie.rating,
            summary: updatedMovie.summary
        }
    }
    const result = await movieCollection.updateOne(filter, movie, options);
    res.send(result);
})


app.get('/', (req, res) => {
    res.send('MovieMaster Pro Server is running')
})

app.listen(port, () => {
    console.log(`Movie Server is running on port: ${port}`)
})