const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

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
