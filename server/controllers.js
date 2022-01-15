const models = require('./models.js');
const pool = require('../database/index.js');

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
  getProductReviews: (req, res) => {
    const { product_id } = req.params;
    models.getProductReviews(product_id)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  },
  getProductReviewMetadata: (req, res) => {
    const { product_id } = req.params;
    models.getProductReviewMetadata(product_id)
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
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