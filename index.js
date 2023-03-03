const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from petMart!');
});

app.listen(port, () => {
    console.log(`petMart app listening on port ${port}`);
});