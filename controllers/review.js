const DB = require("../dbConnect");
const { deleteMenu } = require("./menu");

var postReview = (req, res, next) => {
  const user_id = req.payload.id;
  const restaurant_id = req.body.restaurant_id;
  DB.query(
    "SELECT * FROM `order` WHERE ofk_user_id = ? AND ofk_restaurant_id = ? AND order_status='EXECUTED'",
    [user_id, restaurant_id],
    (err, result) => {
      if (err) throw err;
      else if (result.length > 0) {
        const rating = req.body.rating;
        const review = req.body.review;
        DB.query(
          "INSERT INTO `review` (rating,review_comment,rfk_user_id,rfk_restaurant_id) VALUES (?,?,?,?)",
          [rating, review, user_id, restaurant_id],
          (err, result) => {
            if (err) throw err;
            else {
              res.send("Posted successfully");
            }
            next();
          }
        );
      } else {
        res.send("Cannot post a review without having ordered once");
      }
    }
  );
};

var showReviewOfaUser = (req, res, next) => {
  const user_id = req.payload.id;
  DB.query(
    "SELECT review.review_id,review.rating,review.review_comment,review.rfk_restaurant_id,restaurant.restaurant_name FROM review INNER JOIN restaurant ON review.rfk_restaurant_id=restaurant_id AND review.rfk_user_id=?",
    [user_id],
    (err, result) => {
      if (err) throw err;
      else {
        res.send(result);
      }
      next();
    }
  );
};

var editReview = (req, res, next) => {
  const review_id = req.params.reviewId;
  const rating = req.body.rating;
  const review_comment = req.body.review_comment;
  const user_id = req.payload.id;
  DB.query(
    "UPDATE `review` SET rating=?, review_comment=? WHERE review_id=? AND rfk_user_id=?",
    [rating, review_comment, review_id, user_id],
    (err, result) => {
      if (err) throw err;
      else {
        res.send("Updated successfully");
      }
      next();
    }
  );
};

var deleteReview = (req, res, next) => {
  const review_id = req.params.reviewId;
  const user_id = req.payload.id;
  DB.query(
    "DELETE FROM `review` WHERE review_id=? AND rfk_user_id=?",
    [review_id, user_id],
    (err, result) => {
      if (err) throw err;
      else {
        res.send("Deleted");
      }
      next();
    }
  );
};

const Review = {};
Review.postReview = postReview;
Review.showReviewOfaUser = showReviewOfaUser;
Review.editReview = editReview;
Review.deleteReview = deleteReview;
module.exports = Review;
