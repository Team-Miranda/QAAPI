
const {Pool, Client} = require('pg');

const pool = new Pool({
  database: 'qa'
});

// GET ALL QUESTIONS FOR GIVEN PRODUCT
module.exports.getQuestions = (productId, page = 1, count = 5) => {
  // console.log(productId, page, count)
  return pool.query(`
  SELECT *
  FROM questions
  WHERE product_id = ${productId}
  ORDER BY id
  OFFSET ${page * count - count}
  FETCH NEXT ${count} ROWS ONLY;`)
    .then(res => res.rows)
    .catch(err => err);
}

// GET ALL ANSWERS FOR A GIVEN QUESTION
module.exports.getAnswers = (questionId, page = 1, count = 5) => {
  return pool.query(`
  SELECT answers.id, answers.body, answers.date_written,
    answers.answerer_name, answers.answerer_email, answers.reported, answers.helpful,
    COALESCE (json_agg(json_build_object('id', photos.id, 'answer id', answer_id, 'url', photos.url)) FILTER (WHERE photos.id IS NOT NULL), '[]')
     AS photos
  FROM answers
  LEFT JOIN photos ON answers.id = photos.answer_id
  WHERE answers.question_id = ${questionId}
  GROUP BY answers.id;
  `)
  .then(res => res.rows)
  .catch(err => err)
}

// ADD A NEW QUESTION FOR A PRODUCT
module.exports.addQuestion = (body, name, email, productId, time) => {
  console.log('addQuestion to db: ', body, name, email, productId, time)
  return pool.query(`
    INSERT INTO questions (id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
    VALUES (default, ${productId}, '${body}', ${time}, '${name}', '${email}', false, 0);
  `)
  .then(res => res.rows)
  .catch(err => err)
}

// ADD A NEW ANSWER FOR A QUESTION
module.exports.addAnswer = (questionId, body, time, name, email, photos) => {
  // console.log('addAnswer to db: ', questionId, body, name, email, photos, time)
  return pool.query(`
    INSERT INTO answers (id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
    VALUES (default, ${questionId}, '${body}', ${time}, '${name}', '${email}', false, 0);
  `)
  .then(res => res.rows)
  .catch(err => err)
}