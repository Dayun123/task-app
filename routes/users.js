const express = require('express');
const User = require('../src/models/user');

const router = express.Router();

router.post('/', (req, res, next) => {
  res.status(201).json({ user: new User(req.body) });
});

module.exports = router;
