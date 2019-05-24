const auth = require('basic-auth');
const User = require('../models/user');

const authenticateUser = (req, res, next) => {
  const cred = auth(req);
  if(cred) {
    //auth(req).name and auth(req).pass are naming conventions from basic-auth npm documentation.
    User.auth(cred.name, cred.pass, (err, user) => {
      if(err) {
        return next(err);
      } else if (!user) {
        const err = new Error('Password did not match')
        err.status = 401;
        return next(err);
      } else if (user) {
        req.activeUser = user;
        return next();
      }
    })
  } else {
    const err = new Error('Authentication header not found');
    err.status = 401;
    return next(err);
  }
}

module.exports.authenticateUser = authenticateUser;
