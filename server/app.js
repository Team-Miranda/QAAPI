// SERVER

const express = require('express');
const app = express();
const path = require('path');
const db = require('./db/index.js');

app.use(express.json());
// app.use(express.responseTime());
// app.use(express.static())


// GET ALL QUESTIONS FOR GIVEN PRODUCT
app.get('/qa/questions', (req, res) => {
  let query = req.query;

  db.getQuestions(query.product_id, query.page, query.count)
    .then(questions => {
      res.status(200).send(JSON.stringify(questions))})
    .catch(err => {console.log(err); res.status(500).send(err)});
})

// GET ALL ANSWERS FOR A GIVEN QUESTION
app.get('/qa/questions/:question_id/answers', (req, res) => {
  let params = req.params;
  let query = req.query;

  db.getAnswers(params.question_id, query.page, query.count)
    .then(answers => {
      console.log(answers);
      res.status(200).send(JSON.stringify(answers))})
    .catch(err => { res.status(500).send(err) });
})

// ADD A NEW QUESTION FOR A PRODUCT
app.post('/qa/questions', (req, res) => {
  console.log('POST QUESTION: \n', req.body);
  let body = req.body;
  let newEntryTime = Math.round(new Date().getTime()).toString();

  db.addQuestion(body.body, body.name, body.email, body.product_id, newEntryTime)
  .then(answers => {
    console.log(answers);
    res.status(201).send('created')
  })
  .catch(err => { res.status(500).send(err) });
})

// ADD A NEW ANSWER FOR A QUESTION
app.post('/qa/questions/:question_id/answers', (req, res) => {
  console.log('POST ANSWER: \n', req.params);
  let body = req.body;
  let params = req.params;
  let newEntryTime = Math.round(new Date().getTime()).toString();

  db.addAnswer(params.question_id, body.body, newEntryTime, body.name, body.email, body.photos)
  .then(response => {
    console.log(response);
    res.status(201).send('created')
  })
  .catch(err => { res.status(500).send(err) });
})

// MARK A QUESTION AS HELPFUL
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  
})


app.listen(3000, () => {console.log('listening on port 3000')})