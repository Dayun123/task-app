const express = require('express');
const User = require('../src/models/user');
const validateContentType = require('../src/middleware/validateContentType');

const router = express.Router();

router.post('/', validateContentType, async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user.profile);
  } catch (e) {
    next(e);
  }
});

router.use((err, req, res, next) => {
  if (isNaN(err.status)) return res.status(500).json({ msg: err.message });
  res.status(err.status).json({ msg: err.message });
});

module.exports = router;
