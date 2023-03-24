const express = require("express")
const http = require("http")
const mongodb = require("mongodb")
const app = express()
app.use(express.static(__dirname))
const server = http.createServer(app)
const randomString = require("randomstring")
app.use(express.text({type:"*/*"}))

let database;
(async ()=>{
    const mongoClient = mongodb.MongoClient;
    const db = await mongoClient.connect("mongodb://localhost:27017/")
    database = db.db("url-shortener");
})
app.post("/r", async(req, res)=>{
    const url = req.body;
    const code = randomString.generate(7)
    const obj = {url, code};
    await database.collection("urls").insertOne(obj)
    res.send(obj)
})

app.get("/r/:code", async(req, res)=>{
    const code = req.params.code
    const result = await database.collabration("urls").findOne({code})
    res.redirect(result.url)
})
server.listen(80)