const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const pug = require('pug');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/registration-form', { 
  useNewUrlParser: true,
  useUnifiedTopology: true 
});


app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes/index');
app.use('/', routes);

module.exports = app;