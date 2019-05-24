'use strict';

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Course = require("../models/course");
const Review = require("../models/review");
const midAuthUser = require("../middleware").authenticateUser;

//GET /api/users
router.get('/api/users', midAuthUser, (req, res, next) => {
  res
    .status(200)
    .json(req.activeUser);
    return res.end();
});


//POST /api/users
router.post('/api/users', (req, res, next) => {
  //create user
  //User is a model. user is a document with request body
  const user = new User(req.body);
  user.save((err) => {
    if(err){
      err.status = 400;
      return next(err);
    }
    res
      .status(201)
      .set('Location', '/')
      .end();
  });
});



//GET /api/courses
router.get('/api/courses', (req, res, next) => {
  Course.find({}, {title: true})
    .exec((err, courses) => {
      if(err)  return next(err);
      res
        .status(200)
        .json(courses);
    })
	});


//GET /api/course/:courseId
router.get('/api/courses/:courseId', (req, res, next) => {
  Course.findById(req.params.courseId)
    //.populate path is based on Course model, select is based on User Model
    .populate({path: 'user', select: 'fullName'})
    .populate({path: 'reviews'})
    .exec((err, course) => {
      if(err) return next(err);
      res
        .status(200)
        .json(course);
    })
});

//POST /api/courses
router.post('/api/courses', midAuthUser, (req, res, next) => {
  const course = new Course(req.body);
  course.save((err) => {
    if(err) {
      err.status = 400;
      return next(err);
    }
    res
      .location('/')
      .status(201)
      .end();
  });
});

//PUT /api/courses/:courseId
router.put('/api/courses/:courseId', midAuthUser, (req, res, next) => {
  Course.findById(req.params.courseId)
  .update(req.body)
  .exec((err, course) => {
    if(err) {
      err.status = 400;
      return next(err);
    }
    res
      .location('/')
      .status(204)
      .json(course);
  })
});

router.post('/api/courses/:courseId/reviews', midAuthUser, (req, res, next) => {
  const review = new Review(req.body);
  review.save((err) => {
    if(err) {
      err.status = 400;
      return next(err);
    }
    Course.findById(req.params.courseId)
      .exec((err, course) => {
        if(err) return next(err);
        course.reviews.push(review);
        course.save((err) => {
          if(err) {
            err.status = 400;
            return next(err);
          }
          res
            .location('/')
            .status(201)
            .end();
        });
      })

  });
});

module.exports = router;
