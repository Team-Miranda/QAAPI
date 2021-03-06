// SERVER

const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const compression = require('compression')
const db = require('./db/index.js');

app.use(express.json());
app.use(morgan('dev'))
app.use(compression())
app.use(express.static('public'))

app.get('/test', (req, res) => {
  db.test()
    .then((response) => {
      res.status(200).send(response)
    })
    .catch((err) => {
      res.status(500).send(err.stack);
    })

})

// GET ALL QUESTIONS FOR GIVEN PRODUCT
app.get('/qa/questions', (req, res) => {
  let query = req.query;
  console.log('GET QUESTIONS FOR PRODUCT ', query.product_id)

  db.getQuestions(query.product_id, query.page, query.count)
    .then((questions) => {
      res.status(200).send({
        product_id: query.product_id,
        results: questions,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err.stack);
    });
});

// GET ALL ANSWERS FOR A GIVEN QUESTION
app.get('/qa/questions/:question_id/answers', (req, res) => {
  let params = req.params;
  let query = req.query;
  console.log('GET ANSWERS FOR QUESTION ', params.question_id)

  db.getAnswers(params.question_id, query.page, query.count)
    .then((answers) => {
      res.status(200).send({
        qestion: params.question_id,
        page: query.page || 1,
        count: query.count || 5,
        results: answers,
      });
    })
    .catch((err) => {
      res.status(500).send(err.stack);
    });
});

// ADD A NEW QUESTION FOR A PRODUCT
app.post('/qa/questions', (req, res) => {
  let body = req.body;
  let newEntryTime = Math.round(new Date().getTime()).toString();
  console.log('POST QUESTION: ', body.body)

  db.addQuestion(body.body, body.name, body.email, body.product_id, newEntryTime)
    .then((answers) => {
      res.status(201).send('CREATED');
    })
    .catch((err) => {
      res.status(500).send(err.stack);
    });
});

// ADD A NEW ANSWER FOR A QUESTION
app.post('/qa/questions/:question_id/answers', (req, res) => {
  let body = req.body;
  let params = req.params;
  let newEntryTime = Math.round(new Date().getTime()).toString();
  console.log('POST ANSWER: ', body.body)

  db.addAnswer(params.question_id, body.body, newEntryTime, body.name, body.email, body.photos)
    .then((response) => {
      res.status(201).send('CREATED');
    })
    .catch((err) => {
      res.status(500).send(err.stack);
    });
});

// MARK A QUESTION AS HELPFUL
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  db.updateQuestionHelpful(req.params.question_id)
    .then((success) => res.status(204).send('marked as helpful'))
    .catch((err) => res.status(500).send(err));
});

// REPORT A QUESTION
app.put('/qa/questions/:question_id/report', (req, res) => {
  db.reportQuestion(req.params.question_id)
    .then((success) => res.status(204).send('reported'))
    .catch((err) => res.status(500).send(err));
});

// MARK AN ANSWER AS HELPFUL
app.put('/qa/answers/:answer_id/helpful', (req, res) => {

  db.updateAnswerHelpful(req.params.answer_id)
    .then((success) => res.status(204).send('marked as helpful'))
    .catch((err) => res.status(500).send(err));
});

// REPORT AN ANSWER
app.put('/qa/answers/:answer_id/report', (req, res) => {
  db.reportAnswer(req.params.answer_id)
    .then((success) => res.status(204).send('reported'))
    .catch((err) => res.status(500).send(err));
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
