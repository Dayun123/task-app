const jwt = require('jsonwebtoken');
const User = require('../models/user');
const loadConfig = require('../utils/loadConfig');
const ResponseError = require('../utils/responseError');

module.exports = async (req, res, next) => {
  try {
    const config = await loadConfig();
    if (!req.get('Authorization')) throw new ResponseError(401, 'Must include a JWT in an Authorization header');
    const token = req.get('Authorization').replace('Bearer ', '');
    const _id = jwt.verify(token, config.secret)._id;
    const user = await User.findById(_id);
    if (!user) throw new ResponseError(404, 'User not found');
    if (!user.authTokens.includes(token)) throw new ResponseError(401, 'Invalid JWT')
    res.locals.user = user;
    next();
  } catch (e) {
    if (e.message.includes('invalid signature')) {
      e = new ResponseError(401, 'Must include a valid JWT');
    }
    next(e);
  }
};