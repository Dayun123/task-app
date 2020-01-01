const express = require('express');
const User = require('../src/models/user');
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

module.exports = router;