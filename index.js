
// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const app = express();
// const port = process.env.PORT || 5000;


// app.use(cors());
// app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k0txmhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
   

//     const movieCollection = client.db('movieMasterDB').collection('movies');

    
//     app.post('/movies', async (req, res) => {
//         const newMovie = req.body;
//         console.log('Adding new movie:', newMovie);
//         const result = await movieCollection.insertOne(newMovie);
//         res.send(result);
//     });

    
   
//     app.get('/movies', async (req, res) => {
//         const searchEmail = req.query.email; 
//         let query = {};
        
//         if (searchEmail) {
//             query = { email: searchEmail }; 
//         }
        
//         const cursor = movieCollection.find(query);
//         const result = await cursor.toArray();
//         res.send(result);
//     });

    
//     app.get('/movies/:id', async (req, res) => {
//         const id = req.params.id;
//         const query = { _id: new ObjectId(id) };
//         const result = await movieCollection.findOne(query);
//         res.send(result);
//     });


    
//     // ৬. পরিসংখ্যান বা Stats পাওয়ার API (Real-time)
//     app.get('/stats', async (req, res) => {
//         try {
//             // মোট মুভি সংখ্যা
//             const movieCount = await movieCollection.estimatedDocumentCount();
            
//             // মোট কতজন ইউজার মুভি অ্যাড করেছে (Unique Email)
//             const uniqueUsers = await movieCollection.distinct('email'); 
//             const userCount = uniqueUsers.length;

//             console.log("Stats Sent -> Movies:", movieCount, "Users:", userCount);
            
//             res.send({ movieCount, userCount });
//         } catch (error) {
//             console.error("Stats Error:", error);
//             res.status(500).send({ message: "Error fetching stats" });
//         }
//     });
    
//     app.delete('/movies/:id', async (req, res) => {
//         const id = req.params.id;
//         const query = { _id: new ObjectId(id) };
//         const result = await movieCollection.deleteOne(query);
//         res.send(result);
//     });

   
//     app.put('/movies/:id', async (req, res) => {
//         const id = req.params.id;
//         const filter = { _id: new ObjectId(id) };
//         const options = { upsert: true };
//         const updatedMovie = req.body;
//         const movie = {
//             $set: {
//                 title: updatedMovie.title,
//                 poster: updatedMovie.poster,
//                 genre: updatedMovie.genre,
//                 duration: updatedMovie.duration,
//                 releaseYear: updatedMovie.releaseYear,
//                 rating: updatedMovie.rating,
//                 summary: updatedMovie.summary
//             }
//         }
//         const result = await movieCollection.updateOne(filter, movie, options);
//         res.send(result);
//     })

    
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
   
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//     res.send('MovieMaster Pro Server is running')
// })

// app.listen(port, () => {
//     console.log(`Movie Server is running on port: ${port}`)
// })



const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k0txmhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    // await client.connect();

    const movieCollection = client.db('movieMasterDB').collection('movies');

    // ১. মুভি ডাটা সেভ (Create)
    app.post('/movies', async (req, res) => {
        const newMovie = req.body;
        const result = await movieCollection.insertOne(newMovie);
        res.send(result);
    });

    // ২. সব মুভি পাওয়া (Read All) + ইমেইল সার্চ
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

    // ৩. নির্দিষ্ট মুভি পাওয়া (Read One)
    app.get('/movies/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await movieCollection.findOne(query);
        res.send(result);
    });

    // ৪. মুভি ডিলিট করা (Delete)
    app.delete('/movies/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await movieCollection.deleteOne(query);
        res.send(result);
    });

    // ৫. মুভি আপডেট করা (Update)
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

    // ৬. পরিসংখ্যান বা Stats পাওয়ার API (FIXED)
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

    // পিং চেক
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('MovieMaster Pro Server is running')
})

app.listen(port, () => {
    console.log(`Movie Server is running on port: ${port}`)
})