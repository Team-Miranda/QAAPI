CREATE INDEX idx_questions_product
ON questions(product_id);

CREATE INDEX idx_answers_question
ON answers(question_id);

CREATE INDEX idx_photos_answer
ON photos(answer_id);