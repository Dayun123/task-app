const express = require('express');
const User = require('../src/models/user');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ user });
});

module.exports = router;
