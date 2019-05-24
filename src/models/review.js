'use strict';

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema ({
  //_id from users collection
  //ref option is what tells Mongoose which model to use during population
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  postedOn: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String
  }
});
//User model is for the users collection in the database
const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
