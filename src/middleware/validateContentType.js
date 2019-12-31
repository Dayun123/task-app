const ResponseError = require('../utils/responseError');

module.exports = (req, res, next) => {
  try {
    if (req.get('Content-Type') !== 'application/json') throw new ResponseError(415, 'To create a user, the request body must have the `Content-Type: application/json` header');
    next();
  } catch (e) {
    next(e);
  }
};