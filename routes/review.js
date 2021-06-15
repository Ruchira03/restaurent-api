const router = require("express").Router();
const verify = require("./verification");
const review = require("../controllers/review");

router.post(
  "/review",
  [verify.verifyAccessToken, verify.isCustomer],
  review.postReview
);

router.get(
  "/account/reviews",
  [verify.verifyAccessToken, verify.isCustomer],
  review.showReviewOfaUser
);

router.put(
  "/reviews/:reviewId",
  [verify.verifyAccessToken, verify.isCustomer],
  review.editReview
);

router.delete(
  "/reviews/:reviewId",
  [verify.verifyAccessToken, verify.isCustomer],
  review.deleteReview
);

module.exports = router;
