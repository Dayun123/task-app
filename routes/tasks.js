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

router.get('/', auth, async (req, res, next) => {
  const tasks = await Task.find({ owner: res.locals.user._id }, 'description completed _id');
  res.status(200).json(tasks);
});

module.exports = router;