const express = require('express');
const auth = require('../src/middleware/auth');

const router = express.Router();

router.get('/', auth, (req, res, next) => {
  res.status(200).json(res.locals.user.profile);
});

module.exports = router;