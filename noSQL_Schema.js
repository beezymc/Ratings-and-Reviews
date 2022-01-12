const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: { type: Number, unique: true, required: true },
  characteristics: [
    {
      characteristic_id: { type: Number, unique: true, required: true },
      name: { type: String, required: true },
      value: { type: Number, default: 0 }
    }
  ],
  ratings: [
    {
      "1": { type: Number, default: 0 },
      "2": { type: Number, default: 0 },
      "3": { type: Number, default: 0 },
      "4": { type: Number, default: 0 },
      "5": { type: Number, default: 0 }
    }
  ],
  recommended: [
    {
      "true": { type: Number, default: 0 },
      "false": { type: Number, default: 0 }
    }
  ]
});

const reviewerSchema = new mongoose.Schema({
  reviewer_id: { type: Number, unique: true, required: true },
  username: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);
const Reviewer = mongoose.model('Reviewer', reviewerSchema);

const reviewSchema = new mongoose.Schema({
  review_id: { type: Number, unique: true, required: true },
  rating: { type: Number, default: 0 },
  summary: { type: String, required: true },
  body: { type: String, required: true },
  response: String,
  recommend: { type: Boolean, required: true },
  reported: { type: Boolean, default: false },
  reviewer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Reviewer', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  email: { type: String, required: true },
  helpfulness: { type: Number, default: 0 },
  date: { type: String, required: true },
  photos: [
    {
      id: Number,
      url: String
    }
  ]
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = {
  Product,
  Review,
  Reviewer
};