const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const userCollection = client.db('petmart').collection('userCollection');

        //load sample collection
        app.get('/sample', async (req, res) => {
            const query = {};
            const cursor = sampleCollection.find(query);
            const samples = await cursor.toArray();
            res.send(samples);
        });

        //post api----------------------------------------------------------------


        //load all posts
        app.get('/post', async (req, res) => {
            const query = {};
            const cursor = postCollection.find(query);
            const posts = await cursor.toArray();
            res.send(posts);
        });


        //create post api
        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        });

        //upsert single post by id
        app.put('/post/:id', async (req, res) => {
            const id = req.params.id;
            const editedPost = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: editedPost
            };
            const result = await postCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });


        //load single post by id
        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const post = await postCollection.findOne(query);
            res.send(post);
        });


        //post api----------------------------------------------------------------


        //comment api----------------------------------------------------------------




        //comment api----------------------------------------------------------------


        //user api----------------------------------------------------------------


        //load all users
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        //put user to database
        // app.put('/user/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const user = req.body;
        //     const filter = { email: email };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: user,
        //     };
        //     const result = await userCollection.updateOne(filter, updateDoc, options);
        //     const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10d" });
        //     res.send({ result, token });
        // });


        //upsert single user
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        //load single user by email
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            res.send(user);
        });

        //remove a single user api
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

        //user api----------------------------------------------------------------


        //admin api-------------------------------- 
        //check admin api
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin });
        });

        //make admin api
        app.put('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: { role: 'admin' },
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        //remove a single user api
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });
        //admin api--------------------------------  

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