const express = require('express');
const User = require('../src/models/user');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const user = await User.auth(req.body);
    res.status(200).json(user.profile);
  } catch (e) {
    next(e);
  }
});

module.exports = router;