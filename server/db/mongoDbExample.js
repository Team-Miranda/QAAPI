import mongoose from 'mongoose';
const { Schema } = mongoose;

const photosSchema = new Schema({
  id: Number,
  url: String
})

const answersSchema = new Schema({
  id: Number,
  body: String,
  date: String, // or Date?
  answerer_name: String,
  helpfulness: Number,
  reported: Boolean,
  photos: [photosSchema]
})

const questionsSchema = new Schema({
  question_id:  Number,
  product_id: Number,
  question_body:   String,
  question_date: String, // or Date?
  asker_name: String,
  question_helpfulness: Number,
  reported: Boolean,
  answers: [answersSchema]
});

