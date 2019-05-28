const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//Import Routes
const auth = require('./routes/auth');
const posts = require('./routes/posts');

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connected to MongoDB...'))

//Middleware
app.use(express.json());

//Route Middlewares
app.use('/api/user', auth);
app.use('/api/user/posts', posts);

app.listen(3000, () => console.log('Server is working.'));