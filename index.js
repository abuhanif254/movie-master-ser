// const express = require('express');
// const cors = require('cors');  // update cors
// require('dotenv').config();
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const app = express();
// const port = process.env.PORT || 5000;


// const corsOptions = {
//     origin: '*',
//     credentials: true,
//     optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
// app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k0txmhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: false,
//         deprecationErrors: true,
//     }
// });

// async function run() {
//     try {


//         const movieCollection = client.db('movieMasterDB').collection('movies');
//         const watchlistCollection = client.db('movieMasterDB').collection('watchlist'); // নতুন কালেকশন


//         app.post('/movies', async (req, res) => {
//             const newMovie = req.body;
//             const result = await movieCollection.insertOne(newMovie);
//             res.send(result);
//         });


//         app.get('/movies', async (req, res) => {
//             const searchEmail = req.query.email;
//             let query = {};
//             if (searchEmail) {
//                 query = { email: searchEmail };
//             }
//             const cursor = movieCollection.find(query);
//             const result = await cursor.toArray();
//             res.send(result);
//         });


//         app.get('/movies/:id', async (req, res) => {
//             const id = req.params.id;
//             const query = { _id: new ObjectId(id) };
//             const result = await movieCollection.findOne(query);
//             res.send(result);
//         });


//         app.delete('/movies/:id', async (req, res) => {
//             const id = req.params.id;
//             const query = { _id: new ObjectId(id) };
//             const result = await movieCollection.deleteOne(query);
//             res.send(result);
//         });


//         app.put('/movies/:id', async (req, res) => {
//             const id = req.params.id;
//             const filter = { _id: new ObjectId(id) };
//             const options = { upsert: true };
//             const updatedMovie = req.body;
//             const movie = {
//                 $set: {
//                     title: updatedMovie.title,
//                     poster: updatedMovie.poster,
//                     genre: updatedMovie.genre,
//                     duration: updatedMovie.duration,
//                     releaseYear: updatedMovie.releaseYear,
//                     rating: updatedMovie.rating,
//                     summary: updatedMovie.summary
//                 }
//             }
//             const result = await movieCollection.updateOne(filter, movie, options);
//             res.send(result);
//         })


//         app.post('/watchlist', async (req, res) => {
//             const newWatchItem = req.body;
//             console.log("Adding to watchlist", newWatchItem);
//             const result = await watchlistCollection.insertOne(newWatchItem);
//             res.send(result);
//         });


//         app.get('/watchlist', async (req, res) => {
//             const email = req.query.email;
//             const query = { userEmail: email };
//             const result = await watchlistCollection.find(query).toArray();
//             res.send(result);
//         });


//         app.delete('/watchlist/:id', async (req, res) => {
//             const id = req.params.id;
//             const query = { _id: new ObjectId(id) };
//             const result = await watchlistCollection.deleteOne(query);
//             res.send(result);
//         });


//         app.get('/stats', async (req, res) => {
//             try {
//                 const movieCount = await movieCollection.estimatedDocumentCount();
//                 const uniqueUsers = await movieCollection.distinct('email');
//                 const userCount = uniqueUsers.length;

//                 res.send({ movieCount, userCount });
//             } catch (error) {
//                 console.error(error);
//                 res.status(500).send({ message: "Error fetching stats" });
//             }
//         });


//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {

//     }
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

// CORS configuration - আপনার exact URLs
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://enchanting-dasik-7a83a5.netlify.app', // আপনার Netlify URL
        'https://movie-master-ser.vercel.app' // Backend URL
    ],
    credentials: true,
    optionSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k0txmhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
});

let movieCollection;
let watchlistCollection;

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB successfully!");

        movieCollection = client.db('movieMasterDB').collection('movies');
        watchlistCollection = client.db('movieMasterDB').collection('watchlist');

        await client.db("admin").command({ ping: 1 });
        console.log("✅ MongoDB ping successful!");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw error;
    }
}

// Connect to database
connectDB().catch(console.dir);

// ============= Root Route =============
app.get('/', (req, res) => {
    res.json({
        message: '🎬 MovieMaster Pro Server is running',
        status: 'success',
        timestamp: new Date().toISOString(),
        frontend: 'https://enchanting-dasik-7a83a5.netlify.app',
        endpoints: {
            movies: '/movies',
            watchlist: '/watchlist',
            stats: '/stats',
            health: '/health'
        }
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        database: client.topology?.isConnected() ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// ============= Movie Routes =============

// Add new movie
app.post('/movies', async (req, res) => {
    try {
        if (!movieCollection) {
            return res.status(503).send({ message: "Database not connected" });
        }
        const newMovie = req.body;
        console.log("Adding new movie:", newMovie.title);
        const result = await movieCollection.insertOne(newMovie);
        res.status(201).send(result);
    } catch (error) {
        console.error('❌ Error adding movie:', error);
        res.status(500).send({ message: "Error adding movie", error: error.message });
    }
});

// Get all movies or movies by email/genre
app.get('/movies', async (req, res) => {
    try {
        if (!movieCollection) {
            return res.status(503).send({ message: "Database not connected" });
        }
        const searchEmail = req.query.email;
        const genre = req.query.genre;
        
        let query = {};
        if (searchEmail) {
            query.email = searchEmail;
        }
        if (genre && genre !== 'All') {
            query.genre = genre;
        }
        
        console.log("Fetching movies with query:", query);
        const cursor = movieCollection.find(query);
        const result = await cursor.toArray();
        console.log(`✅ Found ${result.length} movies`);
        res.send(result);
    } catch (error) {
        console.error('❌ Error fetching movies:', error);
        res.status(500).send({ message: "Error fetching movies", error: error.message });
    }
});

// Get single movie by ID
app.get('/movies/:id', async (req, res) => {
    try {
        if (!movieCollection) {
            return res.status(503).send({ message: "Database not connected" });
        }
        const id = req.params.id;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid movie ID" });
        }
        
        const query = { _id: new ObjectId(id) };
        const result = await movieCollection.findOne(query);
        
        if (!result) {
            return res.status(404).send({ message: "Movie not found" });
        }
        
        console.log("✅ Movie found:", result.title);
        res.send(result);
    } catch (error) {
        console.error('❌ Error fetching movie:', error);
        res.status(500).send({ message: "Error fetching movie", error: error.message });
    }
});

// Delete movie by ID
app.delete('/movies/:id', async (req, res) => {
    try {
        if (!movieCollection) {
            return res.status(503).send({ message: "Database not connected" });
        }
        const id = req.params.id;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid movie ID" });
        }
        
        const query = { _id: new ObjectId(id) };
        const result = await movieCollection.deleteOne(query);
        
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "Movie not found" });
        }
        
        console.log("✅ Movie deleted successfully");
        res.send(result);
    } catch (error) {
        console.error('❌ Error deleting movie:', error);
        res.status(500).send({ message: "Error deleting movie", error: error.message });
    }
});

// Update movie by ID
app.put('/movies/:id', async (req, res) => {
    try {
        if (!movieCollection) {
            return res.status(503).send({ message: "Database not connected" });
        }
        const id = req.params.id;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid movie ID" });
        }
        
        const filter = { _id: new ObjectId(id) };
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
        };
        
        const result = await movieCollection.updateOne(filter, movie);
        
        if (result.matchedCount === 0) {
            return res.status(404).send({ message: "Movie not found" });
        }
        
        console.log("✅ Movie updated successfully");
        res.send(result);
    } catch (error) {
        console.error('❌ Error updating movie:', error);
        res.status(500).send({ message: "Error updating movie", error: error.message });
    }
});

// ============= Watchlist Routes =============

// Add to watchlist
app.post('/watchlist', async (req, res) => {
    try {
        if (!watchlistCollection) {
            return res.status(503).send({ message: "Database not connected" });
        }
        const newWatchItem = req.body;
        console.log("Adding to watchlist:", newWatchItem);
        
        // Check if already in watchlist
        const existing = await watchlistCollection.findOne({
            movieId: newWatchItem.movieId,
            userEmail: newWatchItem.userEmail
        });
        
        if (existing) {
            return res.status(400).send({ message: "Movie already in watchlist" });
        }
        
        const result = await watchlistCollection.insertOne(newWatchItem);
        console.log("✅ Added to watchlist successfully");
        res.status(201).send(result);
    } catch (error) {
        console.error('❌ Error adding to watchlist:', error);
        res.status(500).send({ message: "Error adding to watchlist", error: error.message });
    }
});

// Get watchlist by email
app.get('/watchlist', async (req, res) => {
    try {
        if (!watchlistCollection) {
            return res.status(503).send({ message: "Database not connected" });
        }
        const email = req.query.email;
        
        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }
        
        const query = { userEmail: email };
        const result = await watchlistCollection.find(query).toArray();
        console.log(`✅ Found ${result.length} watchlist items for ${email}`);
        res.send(result);
    } catch (error) {
        console.error('❌ Error fetching watchlist:', error);
        res.status(500).send({ message: "Error fetching watchlist", error: error.message });
    }
});

// Delete from watchlist
app.delete('/watchlist/:id', async (req, res) => {
    try {
        if (!watchlistCollection) {
            return res.status(503).send({ message: "Database not connected" });   // database error
        }
        const id = req.params.id;
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid watchlist ID" });
        }
        
        const query = { _id: new ObjectId(id) };
        const result = await watchlistCollection.deleteOne(query);
        
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "Watchlist item not found" });
        }
        
        console.log("✅ Removed from watchlist successfully");
        res.send(result);
    } catch (error) {
        console.error('❌ Error deleting from watchlist:', error);
        res.status(500).send({ message: "Error deleting from watchlist", error: error.message });
    }
});

// ============= Stats Route =============

// Get statistics
app.get('/stats', async (req, res) => {
    try {
        if (!movieCollection) {
            return res.status(503).send({ message: "Database not connected" });
        }
        
        const movieCount = await movieCollection.estimatedDocumentCount();
        const uniqueUsers = await movieCollection.distinct('email');
        const userCount = uniqueUsers.length;

        console.log(`✅ Stats: ${movieCount} movies, ${userCount} users`);
        res.send({ movieCount, userCount });
    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        res.status(500).send({ message: "Error fetching stats", error: error.message });
    }
});

// ============= Error Handlers =============

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        message: "Route not found",
        path: req.path,
        method: req.method
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.stack);
    res.status(500).json({ 
        message: "Something went wrong!", 
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 MovieMaster Pro Server is running on port: ${port}`);
    console.log(`🌐 Backend URL: https://movie-master-ser.vercel.app/`);
    console.log(`🌐 Frontend URL: https://enchanting-dasik-7a83a5.netlify.app/`);
});

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await client.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
});
