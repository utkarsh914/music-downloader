// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 9000;
require('dotenv').config();

const cors = require('cors');

const express = require('express');
const bodyparser = require('body-parser');
const public = require('./routes/public');

var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname+'/public'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.use(cors());

app.use('/', public);

app.listen(port, ()=>{
  console.log(`Server up on port ${port}`);
});