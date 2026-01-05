const express = require('express');
const cors = require('cors');  // update cors
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k0txmhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false, 
    deprecationErrors: true,
  }
});

async function run() {
  try {
   

    const movieCollection = client.db('movieMasterDB').collection('movies');
    const watchlistCollection = client.db('movieMasterDB').collection('watchlist'); // নতুন কালেকশন

    
    app.post('/movies', async (req, res) => {
        const newMovie = req.body;
        const result = await movieCollection.insertOne(newMovie);
        res.send(result);
    });

    
    app.get('/movies', async (req, res) => {
        const searchEmail = req.query.email;
        let query = {};
        if (searchEmail) {
            query = { email: searchEmail };
        }
        const cursor = movieCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    });

   
    app.get('/movies/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await movieCollection.findOne(query);
        res.send(result);
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

   
    app.post('/watchlist', async (req, res) => {
        const newWatchItem = req.body;
        console.log("Adding to watchlist", newWatchItem);
        const result = await watchlistCollection.insertOne(newWatchItem);
        res.send(result);
    });

    
    app.get('/watchlist', async (req, res) => {
        const email = req.query.email;
        const query = { userEmail: email };
        const result = await watchlistCollection.find(query).toArray();
        res.send(result);
    });

    
    app.delete('/watchlist/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await watchlistCollection.deleteOne(query);
        res.send(result);
    });

    
    app.get('/stats', async (req, res) => {
        try {
            const movieCount = await movieCollection.estimatedDocumentCount();
            const uniqueUsers = await movieCollection.distinct('email'); 
            const userCount = uniqueUsers.length;
            
            res.send({ movieCount, userCount });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error fetching stats" });
        }
    });

    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('MovieMaster Pro Server is running')
})

app.listen(port, () => {
    console.log(`Movie Server is running on port: ${port}`)
})