const { Pool, Client } = require('pg');
const {URI} = require('../../SQLConnection.js')

const pool = new Pool({
  connectionString: URI,
});

// GET ALL QUESTIONS FOR GIVEN PRODUCT
module.exports.getQuestions = (productId, page = 1, count = 5) => {
  return pool
    .query(
      `
    SELECT id, product_id, body, to_timestamp(date_written/1000), asker_name, asker_email, reported, helpful AS helpfulness
    FROM questions
    WHERE product_id = ${productId} AND reported = false
    ORDER BY id
    OFFSET ${page * count - count}
    FETCH NEXT ${count} ROWS ONLY;
  `
    )
    .then((res) => res.rows)
    .catch((err) => {
      throw err;
    });
};

// GET ALL ANSWERS FOR A GIVEN QUESTION
module.exports.getAnswers = (questionId, page = 1, count = 5) => {
  return pool
    .query(
      `
    SELECT answers.id AS answer_id, answers.body, to_timestamp(answers.date_written/1000) AS date,
    answers.answerer_name, answers.answerer_email, answers.reported, answers.helpful,
    COALESCE (json_agg(json_build_object('id', photos.id, 'answer id', answer_id, 'url', photos.url)) FILTER (WHERE photos.id IS NOT NULL), '[]')
     AS photos
    FROM answers
    LEFT JOIN photos ON answers.id = photos.answer_id
    WHERE answers.question_id = ${questionId}  AND answers.reported = false
    GROUP BY answers.id;
  `
    )
    .then((res) => res.rows)
    .catch((err) => {
      throw err;
    });
};

// ADD A NEW QUESTION FOR A PRODUCT
module.exports.addQuestion = (body, name, email, productId, time) => {
  return pool
    .query(
      `
    INSERT INTO questions (id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
    VALUES (default, ${productId}, '${body}', ${time}, '${name}', '${email}', false, 0);
  `
    )
    .then((res) => res.rows)
    .catch((err) => {
      throw err;
    });
};

// ADD A NEW ANSWER FOR A QUESTION
module.exports.addAnswer = (questionId, body, time, name, email, photoURLs) => {
  if (photoURLs.length > 0) {
    photoURLs =
      '[' +
      photoURLs.map((each) => {
        return `'${each}'`;
      }) +
      ']';
    return pool
      .query(
        `
    WITH answer_insert AS (
    INSERT INTO answers (id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
    VALUES (default, ${questionId}, '${body}', ${time}, '${name}', '${email}', false, 0)
    RETURNING id)

    INSERT INTO photos (id, answer_id, url)
    VALUES (default, (SELECT id FROM answer_insert), unnest(array${photoURLs}));
  `
      )
      .then((res) => res)
      .catch((err) => {
        throw err;
      });
  } else {
    return pool
      .query(
        `
    INSERT INTO answers (id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
    VALUES (default, ${questionId}, '${body}', ${time}, '${name}', '${email}', false, 0)

      `
      )
      .then((res) => res)
      .catch((err) => {
        throw err;
      });
  }
};

// INCREMENT A QUESTION'S HELPFUL COUNT
module.exports.updateQuestionHelpful = (questionId) => {
  return pool
    .query(
      `
    UPDATE questions
    SET helpful = (helpful + 1)
    WHERE id = ${questionId}
  `
    )
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
};

// REPORT A QUESTION
module.exports.reportQuestion = (questionId) => {
  return pool
    .query(
      `
    UPDATE questions
    SET reported = true
    WHERE id = ${questionId}
  `
    )
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
};

// INCREMENT AN ANSWERS'S HELPFUL COUNT
module.exports.updateAnswerHelpful = (answerId) => {
  return pool
    .query(
      `
    UPDATE answers
    SET helpful = (helpful + 1)
    WHERE id = ${answerId}
  `
    )
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
};

// REPORT AN ANSWER
module.exports.reportAnswer = (answerId) => {
  return pool
    .query(
      `
    UPDATE answers
    SET reported = true
    WHERE id = ${answerId}
  `
    )
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
};
