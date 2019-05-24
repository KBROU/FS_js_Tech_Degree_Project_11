'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema ({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  emailAddress: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

//authentication method on the user model to return the user document based on their credentials
UserSchema.statics.auth = function (emailAddress, password, callback) {
  //findOne email passed in. Looking in JSON format.
  User.findOne({ emailAddress: emailAddress })
    .exec( (err, user) => {
      if(err) {
        return callback (err);
      } else if ( !user ) {
        var err = new Error('User not found in database');
        err.startus = 401;
        return callback (err);
      }
      bcrypt.compare(password, user.password, function(err, result) {
        if (result === true || user.password === password) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

// hash password before saving to database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

//User model is for the users collection in the database
const User = mongoose.model('User', UserSchema);

module.exports = User;
