const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

app.use(cors());

app.use(express.json());


app.get('/', (req, res) => {
    res.send(`Server is running at ${process.env.PORT}`);
});

module.exports = app