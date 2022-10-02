///////////////////////////////
///////// REFRESHER NOTES
///////////////////////////////
// node.js is a backend language to set up servers and controllers. however doing it alone would be quite tedious. 
// Express.js could be described as an interpreter that works with node.js that helps working with node a lot easier. 
// these are both backend languages that you can use to set up servers. 
// embedded javascript (EJS) is a method to render web pages straight from the server (NOT installed on this file though)
// mongoose is an object document "translater". It helps connect your server to MongoDB, since Mongo works with documents, and JS works with objects. 

///////////////////////////////
///////// DEPENDENCIES
///////////////////////////////
// get .env variables
require("dotenv").config()
// using object destructuring on .env file
const {PORT=4000, MONGODB_URL} = process.env
// import express
const express = require ("express")
// create application object
const app = express()
// import mongoose
const mongoose = require("mongoose")
// import middlewares
const cors = require("cors")
const morgan = require("morgan")

///////////////////////////////
///////// DATABASE CONNECTION
///////////////////////////////
// establish connection
mongoose.connect(MONGODB_URL, {useUnifiedTopology: true, useNewUrlParser: true})
// connection event messages
mongoose.connection.on("open", ()=> console.log("You are connected to Mongoose"))
mongoose.connection.on("close", ()=> console.log("Disconnected from Mongoose"))
mongoose.connection.on("error", (error)=> console.log(error, "is Mongoose not running?"))

///////////////////////////////
///////// MODELS
///////////////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})
const People = mongoose.model("People", PeopleSchema)

///////////////////////////////
///////// MiddleWare
///////////////////////////////
// to prevent cors errors, open access to all origins. 
app.use(cors())
app.use(morgan("dev")) // logging
// we used to use expressUrlEncoded, but now we are using JSON.
// in Postman, you need to make the post request as raw > JSON info. 
app.use(express.json()) // parse json bodies

///////////////////////////////
///////// ROUTES
///////////////////////////////
// create a test route
app.get("/", async (req, res) =>{
    try {
        res.render("Home.jsx")
    } catch (error) {
        res.status(400).json(error)
    }
})

app.get("/about", async (req, res) =>{
    try {
        res.render("About.jsx")
    } catch (error) {
        res.status(400).json(error)
    }
})

// INDEX people route
// async/await is being used here because we are "calling our backend". since react will be making the call. 
// this is a common setup for backend devs, including the try/catch setup. 
app.get("/people", async (req, res) => {
    // try/catch is going to attempt to run the following code if it has the data. and translate to json. 
    // catch runs if it doesn't get anything back, and catches the error. 
    // using the curly brackets (instead of ().) is a mongoose interpreter thing. 
    try {
        // send all people
        res.json(await People.find({}))
    } catch (error) {
        // send error
        res.status(400).json(error)
    }
})

// NEW people route
app.post("/people", async(req, res) =>{
    try {
        // send all ppl
        res.json(await People.create(req.body))
    } catch (error) {
        // send error
        res.status(400).json(error)
    }
})

// DELETE people route
app.delete("/people/:id", async(req, res) =>{
    try {
        res.json(await People.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

// UPDATE people route
app.put("/people/:id", async(req, res) =>{
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new:true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// SHOW people route
app.get("/people/:id", async(req, res) =>{
    try {
        res.json(await People.findById(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

///////////////////////////////
///////// LISTENER
///////////////////////////////
app.listen(PORT, () => console.log(`listening on port ${PORT}`))