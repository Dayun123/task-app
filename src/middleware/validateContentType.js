module.exports = (req, res, next) => {
  if (req.get('Content-Type') !== 'application/json') {
    throw new Error('To create a user, the request body must have the `Content-Type: application/json` header');
  }
  next();
};