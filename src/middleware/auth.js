const jwt = require('jsonwebtoken');
const User = require('../models/user');
const loadConfig = require('../utils/loadConfig');

module.exports = async (req, res, next) => {
  const config = await loadConfig();
  const token = req.get('Authorization').replace('Bearer ', '');
  const _id = jwt.verify(token, config.secret)._id;
  const user = await User.findById(_id);
  res.locals.user = user;
  next();
};