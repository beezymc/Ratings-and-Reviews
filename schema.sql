DROP DATABASE IF EXISTS ratings_and_reviews;

CREATE DATABASE ratings_and_reviews;

\c ratings_and_reviews;

CREATE TABLE products (
  product_id INTEGER PRIMARY KEY NOT NULL
);

CREATE TABLE characteristics (
  characteristic_id SERIAL PRIMARY KEY,
  name CHAR(100) NOT NULL,
  FOREIGN KEY product_id INTEGER REFERENCES products(product_id)
);

CREATE TABLE characteristics_ratings (
  id SERIAL PRIMARY KEY,
  FOREIGN KEY review_id INTEGER REFERENCES reviews(review_id)
  FOREIGN KEY characteristic_id INTEGER REFERENCES characteristics(characteristic_id)
  score DECIMAL(17,16) DEFAULT 0,
);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  "1" INTEGER DEFAULT 0,
  "2" INTEGER DEFAULT 0,
  "3" INTEGER DEFAULT 0,
  "4" INTEGER DEFAULT 0,
  "5" INTEGER DEFAULT 0,
  FOREIGN KEY product_id INTEGER REFERENCES products(product_id)
);

CREATE TABLE recommended (
  id SERIAL PRIMARY KEY,
  "true" INTEGER DEFAULT 0,
  "false" INTEGER DEFAULT 0,
  FOREIGN KEY product_id INTEGER REFERENCES products(product_id)
);

CREATE TABLE reviewers (
  reviewer_id SERIAL PRIMARY KEY,
  username CHAR(100) UNIQUE NOT NULL
);

-- restrict rating to 1-5?
CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  rating SMALLINT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  response TEXT,
  recommend BOOLEAN NOT NULL,
  product_id INTEGER REFERENCES products(product_id),
  reviewer_id INTEGER REFERENCES reviewers(reviewer_id),
  email CHAR(100) NOT NULL,
  "date" TIMESTAMP WITH TIME ZONE,
  helpfulness INTEGER DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE review_photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR(200),
  FOREIGN KEY review_id INTEGER REFERENCES reviews(review_id)
);
