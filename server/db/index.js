// const postgres = require('postgres')

// const sql = postgres({ ...options }) // will default to the same as psql

// await sql`
//   select name, age from users
// `


const {Pool, Client} = require('pg');

const pool = new Pool({
  database: 'qa'
});

// pool.query('select * from questions where id < 100', (err, res) => {
//   console.log('error: ', err, '\nresponse: ', res.rows);
//   pool.end();
// })

const getQuestions = (productId) => {
  pool.query(`select * from questions where product_id = ${productId}`, (err, res) => {
    console.log(res.rows);
    return res.rows;
  })
}

const getAnswers = (questionId) => {
  pool.query(`select * from answers where question_id = ${questionId}`, (err, res) => {
    console.log(res.rows);
    return res.rows;
  })
}

const getPhotos = (answerId) => {
  pool.query(`select * from photos where answer_id = ${answerId}`, (err, res) => {
    console.log(res.rows);
    return res.rows;
  })
}

getPhotos(68543);