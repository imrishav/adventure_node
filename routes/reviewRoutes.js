const express = require('express');

const {
  createReview,
  getAllReviews,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(protect, restrictTo('user'), createReview)
  .get(getAllReviews);

module.exports = router;
