require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const {request, json} = require('express');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Hello world!</h1>');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});