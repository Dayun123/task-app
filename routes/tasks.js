const express = require('express');
const Task = require('../src/models/task');
const auth = require('../src/middleware/auth');

const router = express.Router();

router.post('/', auth, (req, res, next) => {
  const task = new Task(req.body);
  task.owner = res.locals.user._id;
  res.status(201).json(task);
});

module.exports = router;