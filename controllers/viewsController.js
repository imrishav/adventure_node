const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1)get all tour Data
  const tours = await Tour.find();
  // 2) Build Tempalate
  // 3)render template from step 1

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour,
  });
};

exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Log Into account',
  });
};
