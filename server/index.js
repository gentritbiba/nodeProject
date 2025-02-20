const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();


// Connect to db
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true },
    ()=>{console.log("Conneted to DB");});

// Middleware
app.use(express.json());

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');


// Route Middleware
app.use('/api/users', authRoute)
app.use('/api/posts', postRoute)


app.listen(3000, () => console.log("Server Up and running"));