const Router = require('express');
const router = Router();
const controllers = require('./controllers.js');

router.get('/loaderio-016b129c3fdd96489cccbb5c62ffa8e5', (req, res) => {
  res.send('loaderio-016b129c3fdd96489cccbb5c62ffa8e5');
});
router.get('/reviews/reported/:reviewer', controllers.getReportedReviewerData);
router.get('/reviews/meta/:product_id', controllers.getProductReviewMetadata);
router.get('/reviews/:product_id', controllers.getProductReviews);
router.post('/reviews', controllers.postReview);
// router.delete('/reviews/:review_id/delete', controllers.deleteReview);
// router.put('/reviews/:review_id/response', controllers.addResponse);
// router.put('/reviews/:review_id/edit', controllers.editReview);
// router.put('/reviews/:review_id/report', controllers.incrementHelpfulness);
// router.put('/reviews/:review_id/helpful', controllers.markReported);


module.exports = router;