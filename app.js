const express = require('express')

const app = express()

const port = 4000
const mongoose = require("mongoose");
const configdatabase = require("./config/database");
mongoose.Promise = global.Promise;
mongoose.connect(configdatabase.database);
let db = mongoose.connection;
db.once('open', function(){
console.log("connected to MongooDB");});


app.get('/', (req, res) => {

	  res.send('Hello World!')

})



app.listen(port, () => {

	  console.log(`Example app listening at http://localhost:${port}`)

})
