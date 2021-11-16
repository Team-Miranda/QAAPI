
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

