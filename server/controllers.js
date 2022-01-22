const models = require('./models.js');
const pool = require('../database/index.js');
const axios = require('axios');
const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on("error", (error) => {
  console.error(error);
});

const redisStart = async () => {
  await redisClient.connect();
}

redisStart();

module.exports = {
  getReportedReviewerData: (req, res) => {
    const { reviewer } = req.params;
    models.getReportedReviewerData(reviewer)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  },
  getProductReviews: async (req, res) => {
    const productData = await redisClient.get(req.url)
    if (productData) {
      res.send(productData);
    } else {
      const { product_id } = req.params;
      let { count, page, sort } = req.query;
      count = count || 5;
      page = page || 1;
      sort = sort || 'relevant';
      models.getProductReviews(product_id, sort)
        .then(async (response) => {
          const productReviews = {
            product: product_id,
            page: page,
            count: count,
            results: []
          };
          let currReview;
          const reviewIds = new Set();
          for (let i = 0; i < response.length; i++) {
            if (!reviewIds.has(response[i].review_id)) {
              if (productReviews.results.length === (page * count)) break;
              reviewIds.add(response[i].review_id);
              currReview = {
                review_id: response[i].review_id,
                rating: response[i].rating,
                summary: response[i].summary,
                recommend: response[i].recommend,
                response: response[i].response,
                body: response[i].body,
                date: response[i].date,
                reviewer_name: response[i].reviewer,
                helpfulness: response[i].helpfulness,
                photos: []
              }
              productReviews.results.push(currReview);
            }
            if (response[i].id) {
              currReview.photos.push({
                id: response[i].id,
                url: response[i].url
              })
            }
          }
          await redisClient.set(req.url, JSON.stringify(productReviews));
          res.send(productReviews);
      })
      .catch((error) => {
        console.log(error);
        res.status(404).send(error);
      });
    }
  },
  getProductReviewMetadata: async (req, res) => {
    const productData = await redisClient.get(req.url)
    if (productData) {
      res.send(productData);
    } else {
      const { product_id } = req.params;
      models.getProductReviewMetadata(product_id)
      .then(async (response) => {
        const reviewMetadata = {
          product_id: product_id,
          ratings: {
            "1": response.counts[0].one_count,
            "2": response.counts[0].two_count,
            "3": response.counts[0].three_count,
            "4": response.counts[0].four_count,
            "5": response.counts[0].five_count
          },
          recommended: {
            "true": response.counts[0].true_count,
            "false": response.counts[0].false_count
          },
          characteristics: {}
        }
        for (let i = 0; i < response.characteristics.length; i++) {
          reviewMetadata.characteristics[response.characteristics[i].name] = {
            id: response.characteristics[i].characteristic_id,
            value: response.characteristics[i].value
          }
        }
        await redisClient.set(req.url, JSON.stringify(reviewMetadata));
        res.send(reviewMetadata);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
    }
  },
  postReview: (req, res) => {
    const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = req.body;
    models.postReview(product_id, rating, summary, body, recommend, name, email, photos, characteristics)
      .then(() => {
        res.status(201).send();
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  }
};