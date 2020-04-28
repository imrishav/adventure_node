const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactor');

const filterObj = (obj, ...allowedFields) => {
  const newObe = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObe[el] = obj[el];
  });
  return newObe;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllUsers = factory.getAll(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  //1)Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This is not Password Updated, Please used diff route', 400)
    );
  }
  //2)Update user doucments
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});

exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is Not Yet defined Please Use Sign Up Instead',
  });
};
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
