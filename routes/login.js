const express = require('express');
const User = require('../src/models/user');
const auth = require('../src/middleware/auth');
const ResponseError = require('../src/utils/responseError');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.auth(req.body);
    res.status(200).json(user.profile);
  } catch (e) {
    next(new ResponseError(400, e.message));
  }
});

router.post('/logout', auth, (req, res, next) => {
  res.status(200).json(res.locals.user.profile);
});

module.exports = router;