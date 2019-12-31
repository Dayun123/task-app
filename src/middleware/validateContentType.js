const ResponseError = require('../utils/responseError');

module.exports = (req, res, next) => {
  if (req.get('Content-Type') !== 'application/json') {
    throw new ResponseError(415, 'To create a user, the request body must have the `Content-Type: application/json` header');
  }
  next();
};