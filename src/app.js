const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes')
const emailRoutes = require('./routes/emailRoutes')
const app = express()

dotenv.config();

app.use(cors());

app.use(express.json());

app.use('/auth', authRoutes)
app.use('/email', emailRoutes)

app.get('/', (req, res) => {
    res.send(`Server is running at ${process.env.PORT}`);
});

module.exports = app