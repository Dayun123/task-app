const express = require('express');
const User = require('../src/models/user');
const validateContentType = require('../src/middleware/validateContentType');
const auth = require('../src/middleware/auth');
const ResponseError = require('../src/utils/responseError');

const router = express.Router();

router.post('/', validateContentType, async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user.profile);
  } catch (e) {
    next(new ResponseError(400, e.message));
  }
});

router.get('/', auth, (req, res, next) => {
  res.status(200).json(res.locals.user.profile);
});

module.exports = router;
