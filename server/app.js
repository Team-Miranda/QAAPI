// SERVER

const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
// app.use(express.static())

app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(3000, () => {console.log('listening on port 3000')})