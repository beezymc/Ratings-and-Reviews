DROP DATABASE IF EXISTS ratings_and_reviews;

CREATE DATABASE ratings_and_reviews;

\c ratings_and_reviews;

CREATE TEMP TABLE products_temp (
  id SERIAL PRIMARY KEY,
  name TEXT,
  slogan TEXT,
  description TEXT,
  category TEXT,
  default_price INTEGER
);

\copy products_temp FROM './data/product.csv' CSV HEADER;

CREATE TABLE products (
  product_id SERIAL PRIMARY KEY
);

INSERT INTO products(product_id) select id from products_temp;

CREATE TEMP TABLE characteristics_temp (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  name TEXT
);

\copy characteristics_temp FROM './data/characteristics.csv' CSV HEADER;

CREATE TABLE characteristics (
  characteristic_id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  product_id INTEGER NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE INDEX char_product_id_idx ON characteristics(product_id);

INSERT INTO characteristics select id, name, product_id from characteristics_temp;

CREATE TEMP TABLE reviews_temp (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  rating SMALLINT NOT NULL check (rating between 1 and 5),
  "date" BIGINT,
  summary VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT false,
  reviewer_name CHAR(100),
  reviewer_email CHAR(100) NOT NULL,
  response TEXT DEFAULT NULL,
  helpfulness INTEGER DEFAULT 0
);

\copy reviews_temp FROM './data/reviews.csv' CSV HEADER;

-- CREATE TABLE reviewers (
--   reviewer_id SERIAL PRIMARY KEY,
--   username CHAR(100) UNIQUE NOT NULL
-- );

-- INSERT INTO reviewers(username) select reviewer_name from reviews_temp on conflict (username) do nothing;

CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  rating SMALLINT NOT NULL check (rating between 1 and 5),
  summary VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  response TEXT DEFAULT NULL,
  recommend BOOLEAN NOT NULL,
  product_id INTEGER NOT NULL,
  reviewer VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  "date" TIMESTAMP WITH TIME ZONE,
  helpfulness INTEGER DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT false,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE INDEX rev_reported_idx ON reviews(reported);
CREATE INDEX rev_reviewer_idx ON reviews(reviewer);
CREATE INDEX rev_product_id_idx ON reviews(product_id);

INSERT INTO reviews select id, rating, summary, body, response, recommend, product_id, reviewer_name, reviewer_email, to_timestamp("date" / 1000), helpfulness, reported from reviews_temp;

CREATE TEMP TABLE characteristics_reviews_temp (
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER,
  review_id INTEGER,
  value INTEGER
);

\copy characteristics_reviews_temp FROM './data/characteristic_reviews.csv' CSV HEADER;

CREATE TABLE characteristics_reviews (
  id SERIAL PRIMARY KEY,
  value SMALLINT NOT NULL check (value between 1 and 5),
  review_id INTEGER NOT NULL,
  characteristic_id INTEGER NOT NULL,
  FOREIGN KEY (review_id) REFERENCES reviews(review_id),
  FOREIGN KEY (characteristic_id) REFERENCES characteristics(characteristic_id)
);

CREATE INDEX charrev_review_id_idx ON characteristics_reviews(review_id);
CREATE INDEX charrev_char_id_idx ON characteristics_reviews(characteristic_id);

INSERT INTO characteristics_reviews select id, value, review_id, characteristic_id from characteristics_reviews_temp;

CREATE TEMP TABLE review_photos_temp (
  id SERIAL PRIMARY KEY,
  review_id INTEGER,
  url TEXT
);

\copy review_photos_temp FROM './data/reviews_photos.csv' CSV HEADER;

CREATE TABLE review_photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR(200),
  review_id INTEGER NOT NULL,
  FOREIGN KEY (review_id) REFERENCES reviews(review_id)
);

CREATE INDEX revphoto_review_id_idx ON review_photos(review_id);

INSERT INTO review_photos select id, url, review_id from review_photos_temp;