const express = require('express');
const User = require('../src/models/user');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    if (req.get('Content-Type') !== 'application/json') throw new Error('To create a user, the request body must have the `Content-Type: application/json` header');
    const user = await User.create(req.body);
    res.status(201).json(user.profile);
  } catch (e) {
    next(e);
  }
});

router.use((err, req, res, next) => {
  res.status(500).json({ msg: err.message });
});

module.exports = router;
