const { Pool, Client } = require('pg');
const { URI } = require('../../SQLConnection.js');

const pool = new Pool({
  connectionString: URI,
});

module.exports.test = () => {
  return pool
  .query(
    `
    SELECT * FROM questions WHERE id = 1;
`
  )
  .then((res) => res.rows)
  .catch((err) => {
    throw err;
  });
}

// GET ALL QUESTIONS FOR GIVEN PRODUCT
module.exports.getQuestions = (productId, page = 1, count = 5) => {
  return pool
    .query(
      `
      SELECT questions.id AS questions_id, questions.body, to_timestamp(questions.date_written/1000) AS date, questions.asker_name, questions.reported, questions.helpful,
      COALESCE (JSON_OBJECT_AGG(answers.id,
        JSON_BUILD_OBJECT('id', answers.id, 'body', answers.body, 'date', to_timestamp(answers.date_written/1000), 'answerer_name', answers.answerer_name, 'helpfulness', answers.helpful, 'photos', ARRAY (
          SELECT photos.url as URL
          FROM photos
          WHERE photos.answer_id = answers.id
          ))) FILTER (WHERE answers.id IS NOT NULL), '{}'::JSON) AS answers
        FROM questions
        LEFT JOIN answers ON questions.id = answers.question_id
      WHERE product_id = ${productId} AND questions.reported = false
      GROUP BY questions.id
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
