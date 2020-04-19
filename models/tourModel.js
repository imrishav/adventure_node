const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A name is required'],
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  raitingAverage: {
    type: Number,
    default: 4.5,
  },
  raitingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A Price is required'],
  },
  priceDiscount: { type: Number },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Description is needed'],
  },
  description: { type: String, trim: true },
  imageCover: {
    type: String,
    required: [true, 'A Image is requried'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
