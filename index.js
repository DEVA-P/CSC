const express = require('express');
const app = express();
const https = require("https");   
const authRoute = require('./routes/auth');
const { Client } = require('pg')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));


app.use('/login', authRoute); 
app.use("/register", authRoute); 
app.get('/',(req,res)=>{
  res.redirect('/home');
})

const port = process.env.PORT || 8000;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'CSC',
  password: 'vksoftwares2407',
  port: 5432
})

client.connect(function(err) {
  if (err) throw err;
  app.listen(port, () => console.log(`Serve running on port ${port}`)) ;
});