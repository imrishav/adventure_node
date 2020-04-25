const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const User = require('./models/userModel');
const Review = require('./models/reviewModel');
const Tour = require('./models/tourModel');

const userFile = require('./dev-data/data/users.json');
const reviewFile = require('./dev-data/data/reviews.json');
const tourFile = require('./dev-data/data/tours.json');

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB Connection Succesfully');
  });

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/reviews.json', 'utf-8')
);
const importData = async () => {
  try {
    // await Tour.create(tours);
    await Review.create(tours, { validateBeforeSave: false });
    // await User.create(tours, { validateBeforeSave: false });
    // await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

importData();

const port = 3002;
app.listen(process.env.PORT, () => {
  console.log('Tour Project is Running..');
});

process.on('uncaughtException', (err) => {
  console.log('uncaughtException EXCEPTION!! SHUTTING DOWN.....');
  console.log(err.name, err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION!! SHUTTING DOWN.....');
  console.log(err.name, err.message);
  process.exit(1);
});
