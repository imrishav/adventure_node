const { promisify } = require('util');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const bycrypt = require('bcryptjs');
const sendEmail = require('../utils/email');

const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  // const token = signToken(newUser._id);
  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //   1) Check if email password exist
  if (!email || !password) {
    return next(new AppError('Please Provide email, and password', 400));
  }
  //   2)check if user exist and password is correct

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or Password', 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1.) Getting token & check if is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Please Login in First', 401));
  }

  //2.) Validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log(decoded);

  //3.Check if user still exists
  const freshUser = await User.findById(decoded.userId);
  if (!freshUser) {
    return next(new AppError('User Does not exits', 401));
  }

  //4.) if username changed pss after the token was issued
  // freshUser.changedPassAfter(decoded.iat);
  // if (freshUser.changedPassAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User Recently Changed Password Please Login Again', 401)
  //   );
  // }

  //Access Granated...to other routes
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not Have permission', 403));
  }
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1)GEt user based on email

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No User with that email address', 404));
  }

  // 2.)Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3.Send Email
  const resetURl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  console.log(resetURl);

  const message = `Forgot Password? Reset here : ${resetURl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset Token',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Error Sending Emaiddl', 500));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) GEt User based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token is not expired and there is user set hte new password
  if (!user) next(new AppError('Token is invalid or has Expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.createPasswordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  // });
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1)Get user from user HTMLAllCollection
  const user = await User.findById(req.user.id).select('+password');

  // 2)Post pass is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Current Pass is Wrong', 401));
  }
  // 3)Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4)Log user in
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  //   data: {
  //     user,
  //   },
  // });
  createSendToken(user, 200, res);
});
