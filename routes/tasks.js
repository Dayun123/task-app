const express = require('express');
const Task = require('../src/models/task');
const auth = require('../src/middleware/auth');
const ResponseError = require('../src/utils/responseError');

const router = express.Router();

router.post('/', auth, async (req, res, next) => {
  try {
    const task = await Task.create(req.body, res.locals.user);
    res.status(201).json(task.profile);
  } catch (e) {
    next(new ResponseError(400, e.message));
  }
});

router.get('/', auth, (req, res, next) => {
  res.status(200).json([]);
});

module.exports = router;