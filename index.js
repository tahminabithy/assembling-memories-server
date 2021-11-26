const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const app = express()
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0wvo3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('conected with db')
        const database = client.db("AsseblingMemories");
        const touristServiceCollection = database.collection("TouristService");
        const touristInfoCollection = database.collection("TouristInfo")
        //store data client to database
        app.post('/places', async (req, res) => {
            const info = req.body;
            const result = await touristServiceCollection.insertOne(info);
            res.send(result);
        })
        app.post('/touristInfo', async (req, res) => {
            const info = req.body;
            console.log(info);
            const result = await touristInfoCollection.insertOne(info);
            console.log(result);
            res.send(result);
        })
        app.get("/touristInfo", async (req, res) => {
            const result = await touristInfoCollection.find({}).toArray();
            res.send(result)
        })
        app.get("/touristInfo/:email", async (req, res) => {
            const result = await touristInfoCollection.find({ email: req.params.email }).toArray();
            console.log(result);
            res.send(result)
        })



        //Delete info
        app.delete("/touristInfo/:id", async (req, res) => {
            id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await touristInfoCollection.deleteOne(query);
            res.send(result);
        })
        //get all data from database
        app.get('/places', async (req, res) => {
            const result = await touristServiceCollection.find({}).toArray();
            res.send(result)
        })
        //get single data using userid 
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await touristServiceCollection.findOne(query);
            res.send(result)
        })
        app.get('/touristInfoo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await touristInfoCollection.findOne(query);
            res.send(result)
        })

        //update
        app.put('/touristInfoo/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const updatedValue = req.body;
            const query = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedValue.status
                }
            }
            const result = await touristInfoCollection.updateOne(query, updateDoc, option)
            res.send(result)
            // console.log(updatedValue);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('tourist website is running!')
})

app.listen(port, () => {
    console.log(`tourist app listening at http://localhost:${port}`)
})

