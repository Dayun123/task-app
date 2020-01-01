const ResponseError = require('../utils/responseError');

module.exports = async (req, res, next) => {
  console.log(req.file);
  try {
    if (!req.file.mimetype.startsWith('image')) throw new ResponseError(415, 'Avatars must be images');
    res.locals.user.avatar = req.file.buffer;
    await res.locals.user.save();
    next();
  } catch (e) {
    next(e);
  }
};