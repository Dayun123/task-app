const jwt = require('jsonwebtoken');
const User = require('../models/user');
const loadConfig = require('../utils/loadConfig');
const ResponeError = require('../utils/responseError');

module.exports = async (req, res, next) => {
  try {
    const config = await loadConfig();
    if (!req.get('Authorization')) throw new ResponeError(401, 'Must include a JWT in an Authorization header');
    const token = req.get('Authorization').replace('Bearer ', '');
    const _id = jwt.verify(token, config.secret)._id;
    const user = await User.findById(_id);
    res.locals.user = user;
    next();
  } catch (e) {
    next(e);
  }
};