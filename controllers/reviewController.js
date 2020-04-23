const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find().populate('user tour');
  res.status(200).json({
    status: 'Success',
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  console.log(req.body, 'userDetaials');

  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      review,
    },
  });
});
