const express = require('express');
const auth = require('../src/middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  await res.locals.user.generateAuthToken();
  await res.locals.user.save();
  res.status(200).json(res.locals.user.profile);
});

module.exports = router;