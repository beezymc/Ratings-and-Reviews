const pool = require('../database/index.js');

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  //simple route to kick things off--doesn't need improvement.
  getReportedReviewerData: (reviewer) => {
    return pool.connect()
    .then(client => {
      return client.query('select summary, body FROM reviews where reviewer = $1 AND reported = true', [reviewer])
        .then(res => {
          client.release();
          return res.rows;
        })
        .catch(err => {
          client.release();
          return err.stack;
        })
    });
  },
  //Eventually add query params for pages, count, and sort.
  getProductReviews: (product_id, sort) => {
    return pool.connect()
    .then(client => {
      if (sort === 'newest') {
        return client.query('select reviews.review_id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, reviews.date, reviews.reviewer, reviews.helpfulness, review_photos.id, review_photos.url FROM reviews LEFT JOIN review_photos using (review_id) where reviews.product_id = $1 AND reviews.reported = false ORDER BY reviews.date DESC', [product_id])
        .then(res => {
          client.release();
          return res.rows;
        })
        .catch(err => {
          client.release();
          return err.stack;
        })
      } else if (sort === 'helpful') {
        return client.query('select reviews.review_id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, reviews.date, reviews.reviewer, reviews.helpfulness, review_photos.id, review_photos.url FROM reviews LEFT JOIN review_photos using (review_id) where reviews.product_id = $1 AND reviews.reported = false ORDER BY reviews.helpfulness DESC', [product_id])
        .then(res => {
          client.release();
          return res.rows;
        })
        .catch(err => {
          client.release();
          return err.stack;
        })
      } else {
        return client.query('select reviews.review_id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, reviews.date, reviews.reviewer, reviews.helpfulness, review_photos.id, review_photos.url FROM reviews LEFT JOIN review_photos using (review_id) where reviews.product_id = $1 AND reviews.reported = false', [product_id])
        .then(res => {
          client.release();
          return res.rows;
        })
        .catch(err => {
          client.release();
          return err.stack;
        })
      }
    });
  },
  getProductReviewMetadata: (product_id) => {
    const metadata = {};
    return pool.connect()
    .then(client => {
      return client.query('select characteristics.name, characteristics.characteristic_id, AVG(characteristics_reviews.value) as value FROM characteristics_reviews JOIN characteristics using (characteristic_id) where characteristics.product_id = $1 group by characteristics.characteristic_id', [product_id])
        .then(characteristicsRes => {
          metadata.characteristics = characteristicsRes.rows;
          return client.query('select SUM(case when rating = 1 then 1 else 0 end) as one_count, SUM(case when rating = 2 then 1 else 0 end) as two_count, SUM(case when rating = 3 then 1 else 0 end) as three_count, SUM(case when rating = 4 then 1 else 0 end) as four_count, SUM(case when rating = 5 then 1 else 0 end) as five_count, SUM(case when recommend = true then 1 else 0 end) as true_count, SUM(case when recommend = false then 1 else 0 end) as false_count FROM reviews where product_id = $1', [product_id])
            .then(countsRes => {
              metadata.counts = countsRes.rows
              client.release();
              return metadata;
            })
            .catch(err => {
              client.release();
              return err.stack;
            })
        })
        .catch(err => {
          client.release();
          return err.stack;
        })
    });
  },
  postReview: (product_id, rating, summary, body, recommend, name, email, photos, characteristics) => {
    return pool.connect()
    .then(client => {
      return client.query('INSERT INTO reviews(product_id, rating, summary, body, recommend, reviewer, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING review_id', [product_id, rating, summary, body, recommend, name, email])
        .then(res => {
          const review_id = res.rows[0].review_id;
          photos.forEach((url) => {
            client.query('INSERT INTO review_photos(url, review_id) VALUES ($1, $2)', [url, review_id])
              .then (() => {
                client.release();
              })
              .catch(err => {
                client.release();
                return err.stack;
              })
          })
          for (let key in characteristics) {
            client.query('INSERT INTO characteristics_reviews(value, review_id, characteristic_id) VALUES($1, $2, $3)', [characteristics[key], review_id, key])
              .then (() => {
                client.release();
              })
              .catch(err => {
                client.release();
                return err.stack;
              })
          }
          client.release();
        })
        .catch(err => {
          client.release();
          return err.stack;
        })
    });
  }
};
