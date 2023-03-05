const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

//connect with mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9eddyp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const sampleCollection = client.db('petmart').collection('sampleCollection');
        const postCollection = client.db('petmart').collection('postCollection');

        //load sample collection
        app.get('/sample', async (req, res) => {
            const query = {};
            const cursor = sampleCollection.find(query);
            const samples = await cursor.toArray();
            res.send(samples);
        });

        //load all posts
        app.get('/post', async (req, res) => {
            const query = {};
            const cursor = postCollection.find(query);
            const posts = await cursor.toArray();
            res.send(posts);
        });
    }
    finally {

    }
};

run().catch(console.dir);

//root api
app.get('/', (req, res) => {
    res.send('Hello from petMart!');
});

app.listen(port, () => {
    console.log(`petMart app listening on port ${port}`);
});