'use strict';

const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema ({
  //_id from users collection
  //ref option is what tells Mongoose which model to use during population
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  estimatedTime: {
    type: String
  },
  materialsNeeded: {
    type: String
  },
  steps: [
    {
      stepNumber: {
        type: Number
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});
//User model is for the users collection in the database
const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
