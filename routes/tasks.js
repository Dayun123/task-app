const express = require('express');
const Task = require('../src/models/task');
const auth = require('../src/middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res, next) => {
  const task = new Task(req.body);
  task.owner = res.locals.user._id;
  await task.save();
  res.status(201).json(task);
});

module.exports = router;