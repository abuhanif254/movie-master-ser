 MovieMaster Pro Server

This is the backend server for **MovieMaster Pro**, built with Node.js, Express, and MongoDB. It handles all API requests, database operations, and data management for the MovieMaster client application.



 Key Features

* **RESTful API:** Well-structured API endpoints for managing Movies and Users.
* **Database Management:** Uses MongoDB (NoSQL) for efficient data storage and retrieval.
* **CRUD Operations:** Full support for Create, Read, Update, and Delete operations for movies.
* **Search & Filter:** Backend logic to filter movies by User Email.
* **Watchlist Management:** Dedicated endpoints to handle user-specific watchlists.
* **Real-time Statistics:** API endpoint to fetch total movie counts and active user counts instantly.
* **Secure Environment:** Uses `.env` for securing database credentials.
* **CORS Enabled:** Configured to allow requests from the frontend application.

 Technologies Used

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (MongoDB Atlas)
* **Middleware:** CORS, Dotenv

 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Server Health Check |
| `GET` | `/movies` | Get all movies (supports `?email=` query) |
| `GET` | `/movies/:id` | Get details of a single movie |
| `POST` | `/movies` | Add a new movie to the database |
| `PUT` | `/movies/:id` | Update an existing movie |
| `DELETE` | `/movies/:id` | Delete a movie |
| `GET` | `/stats` | Get total movies and user statistics |
| `POST` | `/watchlist` | Add a movie to the user's watchlist |
| `GET` | `/watchlist` | Get watchlist items by user email |
