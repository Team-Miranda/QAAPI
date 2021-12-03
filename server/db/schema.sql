
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  product_id int,
  body varchar(255),
  date_written bigint,
  asker_name varchar(255),
  asker_email varchar(255),
  reported boolean,
  helpful int
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id int,
  body varchar(255),
  date_written bigint,
  answerer_name varchar(50),
  answerer_email varchar(50),
  reported boolean,
  helpful int
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  answer_id int,
  url varchar(255)
);

CREATE INDEX idx_questions_product
ON questions(product_id);

CREATE INDEX idx_answers_question
ON answers(question_id);

CREATE INDEX idx_photos_answer
ON photos(answer_id);

-- do do, index helpful column?

CREATE INDEX idx_questions_helpful ON questions(helpful);
CREATE INDEX idx_answers_helpful ON answers(helpful);

-- CREATE INDEX idx_questions_id ON questions (id);
-- CREATE INDEX idx_answers_id ON answers (id);
-- CREATE INDEX idx_photos_id ON photos (id);

-- CREATE INDEX idx_questions_reported ON questions (reported);
-- CREATE INDEX idx_answers_reported ON answers (reported);