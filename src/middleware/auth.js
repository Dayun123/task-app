const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secret = 'dq6h/K_NT5@6N`CcJa$<db/W)/awTc';

module.exports = async (req, res, next) => {
  const token = req.get('Authorization').replace('Bearer ', '');
  const _id = jwt.verify(token, secret)._id;
  const user = await User.findById(_id);
  res.locals.user = user;
  next();
};