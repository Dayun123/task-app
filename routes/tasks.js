const express = require('express');
const Task = require('../src/models/task');
const auth = require('../src/middleware/auth');

const router = express.Router();

router.post('/', auth, (req, res, next) => {
  res.status(201).json(new Task(req.body));
});

module.exports = router;