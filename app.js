const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalError = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`)); //For  Accessing  static files  Publically

//Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't finds ${req.originalUrl}`, 404));
});

//Error handling
app.use(globalError);

module.exports = app;
